import { hashPassword, comparePassword, generateJWT, verifyJWT } from '../utils/auth';
import { runQuery } from '../config/db';
import { tableDefaultCols } from '../config/db';
import { cleanSlug } from '../utils/cleanSlug';
import { capitalize } from '../utils/capitalize';
import { processRow } from '../utils/processRow';
import { ErrorResponse, userTokenResponse } from '../types/responses';
import Encoder from '../utils/encoder';
import { token } from 'morgan';
import { verifyAuthUserResponse } from '../types/auth';
import { json, Request, Response } from 'express';


// Tipado para el cuerpo de la solicitud de registro
interface RegisterRequestBody {
  slug: string;
  password: string;
}


declare interface registerCols extends tableDefaultCols {
  email: string,
  password: string,
  slug: string
  role?: Array<number> | string
}

export const RegisterUser = async (preData: registerCols) => {
  let { slug, email, title, password, ...props } = preData;

  //for custom role permissions
  const role = preData.role ? JSON.stringify(preData.role) : undefined;

  //prevent custom IDS to add
  if (props.ID) {
    delete props.ID
  }
  //create slug based on title if dont exists
  if (!slug && title) {
    title = cleanSlug(title);
  }

  //only accept formated slugs
  if (slug) {
    slug = cleanSlug(slug);
  }

  if (!title && slug) {
    title = slug.replace(/[-_]+/, "");
    title = capitalize(title);
  }
  if (!email || !slug || !title || !password) {
    return null;
  }
  password = await hashPassword(password);
  const columns = [
    "slug",
    "email",
    "title",
    "password",
  ];
  const values = [
    slug,
    email,
    title,
    password,
  ];

  // Loop through props object and log each value
  for (let key in props) {
    // Ensure the key is a valid key of the registerCols type excluding 'email', 'password', 'slug', and 'title'
    if (props.hasOwnProperty(key)) {
      let item: any = props[key as keyof Omit<registerCols, 'email' | 'password' | 'slug' | 'title'>];
      if (typeof item == "object") {
        item = JSON.stringify(item);
      }
      else if (typeof item == "boolean") {
        item = item ? "1" : "0";
      }
      else if (typeof item == "undefined") {
        item = null;
      }
      if (item) {
        columns.push(key);
        values.push(item)
      }
    }
  }

  const sql = 'INSERT INTO `users` (' + columns.join(",") + ') VALUES (' + values.map(item => "?") + ')';

  try {
    const result = await runQuery(
      sql,
      values
    );
    const user = await runQuery('SELECT * FROM `users` WHERE slug = ?', [slug]);
    return {
      sql,
      error: null,
      data: processRow("users", user[0]),
    };
  } catch (error) {
    return {
      error: error,
      data: null,
    }
  }

}

// Registro de usuario
export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  const { slug, password } = req.body;

  if (!slug || !password) {
    res.status(400).json({ message: 'Faltan datos' });
    return;
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await runQuery(`SELECT * FROM users WHERE slug = ?`, [slug]);
    if (existingUser.length > 0) {
      res.status(400).json({ message: 'Usuario ya existe' });
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Insertar el nuevo usuario en la base de datos
    const result = await runQuery(
      `INSERT INTO users (slug, password) VALUES (?, ?)`,
      [slug, hashedPassword]
    );

    res.status(201).json({ id: result.lastID, slug });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Tipado para el cuerpo de la solicitud de login
interface LoginRequestBody {
  slug: string;
  password: string;
}

const userInfoKeys = ["ID", "title", "slug", "status", "featured_id", "email", "role"];


export const verifyAuthUser = async (cookies?: any): Promise<null | verifyAuthUserResponse> => {
  if (!cookies?.account_data) {
    return null;
  }
  const pre = Encoder.decode(cookies.account_data);
  //only allow user info data
  if (typeof pre !== "object" || typeof pre.token !== "string" || !pre.data) {
    return null;
  }
  if (typeof pre.data.slug != "string") {
    return null;
  }
  try {
    const decoded = verifyJWT(pre.token); // Verificamos el JWT
    if (!decoded) {
      return null;
    }

    const user = await runQuery(`SELECT * FROM users WHERE slug = ?`, [pre.data.slug]);
    if (user.length === 0) {
      return null;
    }
    pre.data = processRow("users", user[0], {
      fields_in: userInfoKeys
    });
    return {
      info: pre,
      auth: decoded,
    }
  } catch (error) {
    return null;
  }

}

// Login de usuario
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  // let { slug, password } = req.body;

  if (!req.token) {
    const auth = await verifyAuthUser(req.cookies)
    if (auth) {
      req.token = auth;
      const preToken = auth.info.token;
      const preInfo = auth.info.data
      res.json({
        key: "account_data",
        token: Encoder.encode({
          token: preToken,
          data: preInfo
        }),
        data: preInfo
      });
      return;
    }
  }
  else {
    const preToken = req.token.info.token;
    const preInfo = req.token.info.data
    res.json({
      key: "account_data",
      token: Encoder.encode({
        token: preToken,
        data: preInfo
      }),
      data: preInfo
    });
    return;
  }
  console.log(req.body);


  let slug = req?.body?.slug ?? undefined;
  let password = req?.body?.password ?? undefined;
  if (!slug && typeof req.query?.slug == "string") {
    slug = req.query.slug;
  }
  if (!password && typeof req.query?.password == "string") {
    password = req.query.password;
  }
  const error: ErrorResponse = {
    code: 400,
    request: "login",
    data: null,
    error: !slug || !password,
    error_message: !slug ? "username required" : !password ? "password require" : null
  }

  if (error.error) {
    res.status(400).json(error);
    return;
  }

  try {
    // Buscar el usuario en la base de datos
    const user = await runQuery(`SELECT * FROM users WHERE slug = ?`, [slug]);
    if (user.length === 0) {
      error.error = true;
      error.error_message = "Wrong username or password";
      res.status(400).json(error);
      return;
      // return;
    }

    // Comparar contraseñas
    const isMatch = await comparePassword(password, user[0].password);
    if (!isMatch) {
      error.error = true;
      error.error_message = "Wrong username or password";
      res.status(400).json(error);
      return;
    }


    // Generar JWT
    const token = generateJWT(user[0].id);
    const userInfo = processRow("users", user[0], {
      fields_in: userInfoKeys
    });
    res.json({
      key: "account_data",
      token: Encoder.encode({
        token,
        data: userInfo
      }),
      data: userInfo
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};
