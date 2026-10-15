import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const clientIdentifier = req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const { success } = await ratelimit.limit(`limit_${clientIdentifier}`);
    if (!success) {
      return res.status(429).json({ message: "Too many requests. Please slow down." });
    }
    next();
  } catch (error) {
    // If rate limiter fails (e.g. network/service issue), don't block user requests
    console.log("Rate limit warning/error:", error.message || error);
    next();
  }
};

export default ratelimiter;
