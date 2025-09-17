import { v4 as uuidv4 } from 'uuid';
export default class CacheService {
    constructor(redisClient, options = {}) {
        this.redisClient = redisClient;
        this.lockTimeout = options.lockTimeout || 5000; // Default lock timeout in milliseconds
        this.retryDelay = options.retryDelay || 100; // Default retry delay in milliseconds
        this.maxRetries = options.maxRetries || 50; // Default maximum number of retries
    }

    async get(key, fetchFunction) {
        const cachedValue = await this.redisClient.get(key);
        if (cachedValue !== null) {
            return JSON.parse(cachedValue);
        }

        const lockKey = `${key}:lock`;
        const lockValue = uuidv4();
        const lockAcquired = await this.acquireLock(lockKey, lockValue);

        if (lockAcquired) {
            try {
                const data = await fetchFunction();
                await this.redisClient.set(key, JSON.stringify(data));
                return data;
            } finally {
                await this.releaseLock(lockKey, lockValue);
            }
        } else {
            return this.waitForData(key);
        }
    }

    async acquireLock(lockKey, lockValue) {
        const result = await this.redisClient.set(lockKey, lockValue, 'NX', 'PX', this.lockTimeout);
        return result === 'OK';
    }

    async releaseLock(lockKey, lockValue) {
        const script = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;
        await this.redisClient.eval(script, 1, lockKey, lockValue);
    }

    async waitForData(key) {
        for (let i = 0; i < this.maxRetries; i++) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            const cachedValue = await this.redisClient.get(key);
            if (cachedValue !== null) {
                return JSON.parse(cachedValue);
            }
        }
        throw new Error('Timeout waiting for data to be cached');
    }

    async set(key, value, ttl = 3600) {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    }

    async delete(key) {
        await this.redisClient.del(key);
    }
    async clear() {
        await this.redisClient.flushdb();
    }
}