import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes';
import { endpointsPreview } from './utils/endpointsPreview';
import cookieParser from 'cookie-parser';
import { emitToUser } from './sockets/emitToUser';

const app = express();


export declare interface RequestQuery extends Request {
    query: Record<string, any>
}

export const queryToJSON = (queryString: string): Record<string, any> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, any> = {};

    params.forEach((value, key) => {
        // Split the key by square brackets for arrays and objects
        const keys = key.replace(/\]/g, '').split(/\[|\]/).filter(Boolean);

        // Traverse the keys to create the nested structure
        let current = result;
        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                // If it's the last key, set the value
                if (current[key]) {
                    // If there's already a value (for arrays), push the value
                    current[key].push(value);
                } else {
                    // Otherwise, assign the value (as an array)
                    current[key] = [value];
                }
            } else {
                // If it's not the last key, traverse deeper
                current[key] = current[key] || {};
                current = current[key];
            }
        });
    });

    return result;
}

app.use((req, res, next) => {
    const query = req.url.split('?')[1];
    Object.assign(req, {
        queryObject: queryToJSON(query)
    })
    res.setHeader("Content-Security-Policy", "default-src 'none'; connect-src 'self' ws:;");
    next();

});
app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin like curl/postman or same-origin
        if (!origin) return callback(null, true);
        return callback(null, true); // allow all origins explicitly
    },
    credentials: true,
}));

// Use the cookie-parser middleware
app.use(cookieParser());
app.use((req, res, next) => {
    // Normalize the path by replacing consecutive slashes with a single slash
    req.url = req.url.replace(/\/+/g, '/');
    req.originalUrl = req.originalUrl.replace(/\/+/g, '/');
    req.query
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.get("/api/", (req: Request, res: Response): void => {
    res.json(endpointsPreview)
});

app.get("/notification/:id", (req: Request, res: Response): void => {
    if (req.params.id == "1") {
        emitToUser(1,"notifications:new",{total:1});
    }
        
    res.json([])
});

app.use('/api/users', (req: Request, res: any, next: any) => {
    req.table = "users";
    next();
}, userRoutes);

export default app;
