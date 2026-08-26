import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Unauthorized. Token is missing." });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || "supersecretjwtkey123";

        const decoded = jwt.verify(token, secret);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden. Admin access required." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ success: false, message: "Unauthorized. Invalid or expired token." });
    }
};
