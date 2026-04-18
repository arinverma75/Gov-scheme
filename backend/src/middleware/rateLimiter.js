const requests = new Map();

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const ipRequests = requests.get(ip).filter(time => now - time < windowMs);
  
  if (ipRequests.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later.'
    });
  }

  ipRequests.push(now);
  requests.set(ip, ipRequests);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    for (const [key, times] of requests.entries()) {
      const filtered = times.filter(t => now - t < windowMs);
      if (filtered.length === 0) requests.delete(key);
      else requests.set(key, filtered);
    }
  }

  next();
};
