import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes';
import { globalConstants } from './utils/globalConstants';
import { endpointsPreview } from './utils/endpointsPreview';

const app = express();

app.use(cors());
app.use((req, res, next) => {
    // Normalize the path by replacing consecutive slashes with a single slash
    req.url = req.url.replace(/\/+/g, '/');
    req.originalUrl = req.originalUrl.replace(/\/+/g, '/');
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.get("/api/",(req: Request, res: Response):void =>{
    res.json(endpointsPreview)
});

app.use('/api/users', (req:Request, res:any, next:any) => {
    globalConstants.table = "users";
    next();
}, userRoutes);

export default app;
