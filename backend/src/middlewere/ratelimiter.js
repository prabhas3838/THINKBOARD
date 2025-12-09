import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("mylimit"); // FIXED SPELLING
    if (!success) {                                        // FIXED SPELLING
      return res.status(429).json({ message: "too many requests" });
    }
    next();
  } catch (error) {
    console.log("rate limit error");
    next(error);
  }
};

export default ratelimiter;
