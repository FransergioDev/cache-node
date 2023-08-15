import 'express-async-errors';
import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import router from './routers/router';

dotenv.config();
const app = express();
const PORT = parseInt(`${process.env.PORT || 3000}`);
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

app.use(morgan('tiny'));
app.use(cors({
    origin: ['http://localhost:3000']
}));
app.use(helmet());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`Server is running at ${HOSTNAME}:${PORT}.`));