import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    console.log("Enter to verify token");
    const authHeaders = req.headers["authorization"];
    console.log("Authorization Header:", authHeaders);

    const token = authHeaders && authHeaders.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(403).json({ message: "Access denied" });
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {

        if (err) {
            console.error(err);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
    });
    console.log("Exit to verify token");
};
