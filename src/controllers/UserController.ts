import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import redis from "../lib/cache";

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
        const cacheKey = "users:all";
        const cacheUsers = await redis.get(cacheKey);

        if (cacheUsers) return res.status(200).json(JSON.parse(cacheUsers));

        const users = await prisma.user.findMany();
        await redis.set(cacheKey, JSON.stringify(users));
        return res.status(200).json(users)
    }

    static async find2(req: Request, res: Response) {
        const cacheKey = "users:all:v2";
        const cacheUsers = await redis.get(cacheKey);

        if (cacheUsers) return res.status(200).json(JSON.parse(cacheUsers));

        const users = await prisma.user.findMany();
        await redis.set(cacheKey, JSON.stringify(users), "EX", 60); // Expiração do valor em cache em 60s
        return res.status(200).json(users)
    }

    static async clearCacheFind(req: Request, res: Response) {
        const cacheKey = "users:all";
        await redis.del(cacheKey);
        res.status(200).json({ message: "Success Clear Cache" })
    }

    static async findErrorTest(req: Request, res: Response) {
        const data = await getUserFromDb();
        return res.status(200).json({ user: data });
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