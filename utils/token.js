import jwt from 'jsonwebtoken'
import Role from '../models/roles.js'


export const generateAccessToken = async (user) => {

    const find = await Role.findById(user.roleId);
    const roleName = find.name;
    return jwt.sign({ userId: user._id, roleId: user.roleId, roleName: roleName }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
};

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}

