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

    static async find3(req: Request, res: Response) {
        const cacheKey = "users:all:v3";
        const cacheUsers = await redis.get(cacheKey);
        const isUsersFromCacheStale = !(await redis.get(`${cacheKey}:validation`));
        const isUsersFromCacheRefetching = (await redis.get(`${cacheKey}:is-refetching`));
        const mustCreateCache = (cacheUsers) ? (isUsersFromCacheStale && !isUsersFromCacheRefetching) : true;


        //Recomendado em fazer em segundo plano: Worker, Fila com ou sem Mensageria
        if (mustCreateCache) {
            await redis.set(`${cacheKey}:is-refetching`, "true");
            setTimeout(async () => {
                console.log("cache is stale - refetching...");
                const users = await prisma.user.findMany();
                await redis.set(cacheKey, JSON.stringify(users));
                await redis.set(`${cacheKey}:validation`, "true", "EX", 60)
                await redis.del(`${cacheKey}:is-refetching`);

                if (!cacheUsers) return res.status(200).json(users);

            }, 0);
        }

        if (cacheUsers) return res.status(200).json(JSON.parse(cacheUsers));
    }


    static async clearCacheFind(req: Request, res: Response) {
        const cacheKey = "users:all";
        await redis.del(cacheKey);
        res.status(200).json({ message: "Success Clear Cache" })
    }

    static async loginWithRateLimit(req: Request, res: Response) {
        const resource = "login";
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        //console.log(`IP:${ip}`);
        const key = `rate-limit-${resource}-${ip}`;
        const requestCount = Number((await redis.get(key)) || 0) + 1;
        console.log(`${key}:COUNT:${requestCount}`);

        if (requestCount > 5) {
            throw new Error('rate-limit');
        }

        await redis.set(key, requestCount, "EX", 30);
        return res.status(200).json({ login: true })
    }

    static async sendSmsToCheckPassportUpdate(req: Request, res: Response) {
        const phone: String = "551699878854";
        const message: String = "Olá segue o código de validação para alterar sua senha: 6969788";
        const idempotencyKey = `idemp:${phone}-message`;
        const sent = await redis.set(idempotencyKey, "sent", "EX", 5, "GET");

        const message_info = (!sent) ? `send sms to ${phone} with message ${message}` : `already sent sms to ${phone} with message ${message}`;

        return res.status((!sent) ? 200 : 500).json({ message: message_info })
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