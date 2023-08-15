import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './users-router';

const router = express.Router();

router.get('/', (req: Request, res: Response) => res.send('Its working'));

router.use('/users', usersRouter);

router.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({
        message: error?.message ?? `Internal Server Error`,
    });
});

// Resposta padrão para quaisquer outras requisições
router.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({ message: "This route does not exist" });
});

export default router;