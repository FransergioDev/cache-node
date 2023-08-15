import IORedis from 'ioredis';

const redis = new IORedis({
    host: process.env.REDIS_HOST, // Redis server hostname or IP address, default is 127.0.0.
    port: 6379,
    password: process.env.REDIS_PASSWORD,
});

export default redis;