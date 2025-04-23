const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token from cookie or Authorization header
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    const token = req.cookies?.token || (
        authHeader && authHeader.startsWith("Bearer") && authHeader.split(" ")[1]
    );

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

/**
 * Middleware to verify admin role
 */
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = req.cookies?.token || (
        authHeader && authHeader.startsWith("Bearer") && authHeader.split(" ")[1]
    );

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admin role required" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

/**
 * Middleware to verify user has specific role
 */
const verifyRole = (role) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const token = req.cookies?.token || (
            authHeader && authHeader.startsWith("Bearer") && authHeader.split(" ")[1]
        );

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== role) {
                return res.status(403).json({ message: `Access denied: ${role} role required` });
            }
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyRole
};
