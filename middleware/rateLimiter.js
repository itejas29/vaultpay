const rateLimit = require("express-rate-limit")
const RedisStore = require("rate-limit-redis").default
const Redis = require("ioredis")

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379
})

redis.on("connect", () => {
    console.log("Redis Connected")
})

const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args)
    }),
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: "Too many requests, try again later" }
})

module.exports = limiter