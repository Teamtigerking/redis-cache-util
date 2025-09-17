declare module '@teamtigerking/redis-cache-util' {
  export default class CacheService {
    constructor(
      redisClient: any,
      options?: {
        lockTimeout?: number,
        retryDelay?: number,
        maxRetries?: number
      }
    );

    get(key: string, fetchFunction: () => Promise<any>): Promise<any>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
  }
}
