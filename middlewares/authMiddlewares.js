import jwt from 'jsonwebtoken'

const protect = (req, res, next) => {
    const authHeader = req.header.authorization;

    if (!authHeader || !authHeader.startWith('Bearer')) {
        return res.status(401).json({ msg: 'No token provided' })
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.body = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token' })
    }
}

export default protect;