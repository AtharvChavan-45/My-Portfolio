import jwt from 'jsonwebtoken';

export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (username === "admin" && password === expectedPassword) {
            // Sign JWT
            const token = jwt.sign(
                { role: "admin" },
                process.env.JWT_SECRET || "supersecretjwtkey123",
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                success: true,
                message: "Admin logged in successfully",
                token
            });
        }

        return res.status(401).json({ success: false, message: "Invalid credentials" });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
