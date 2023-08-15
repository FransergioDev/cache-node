import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getUserFromDb = () => {
    return new Promise(() => {
        throw new Error('This is an error personalized');
    });
};

export default class UserController {
    static async ctrl(req: Request, res: Response) {
        res.status(200).json({ controller: UserController.name, mensage: 'Hello Word!' })
    }

    static async find(req: Request, res: Response) {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    }

    static async findErrorTest(req: Request, res: Response) {
        const data = await getUserFromDb();
        res.status(200).json({ user: data });
    };
}

/*
const ctrl = async (req: Request, res: Response) => {
    res.status(200).json({ controller: 'UserController', mensage: 'Hello Word!' })
}

const find = async (req: Request, res: Response) => {
    console.log("aqui")
    const users = await prisma.user.findMany();
    res.status(200).json(users)
}

const findErrorTest = async (req: Request, res: Response) => {
    const data = await getUserFromDb();
    res.status(200).json({ user: data });
};

export { ctrl, find, findErrorTest };
*/