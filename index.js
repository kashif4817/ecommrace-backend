import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import routes from './routes/authRoutes.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import productRoutes from './routes/productRoutes.js'
import User from './models/user.js';
import { verifyToken } from './middlewares/verifyToken.js';
import Role from './models/roles.js';
import user from './models/user.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send("Hey Wellcome!")
    console.log("Hey Wellcome!")
})


// app.get("/home", verifyToken, async (req, res) => {
//     try {
//         console.log("Enter in Home try ");
//         const userRoleId = req.user.roleId;
//         const userRoleName = req.user.roleName;
        
//         // console.log('userRoleId', userRoleId);

//         const roleName = await Role.findById(userRoleId);
//         // console.log('roleName', userRoleId.name);
//         // console.log('userRoleId', userRoleId)
//         res.json({
//             success: true,
//             userId: req.user.id,
//             roleId: userRoleId,
//             roleName: roleName.name,
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// });

app.use('/api/auth', routes)
app.use('/api/products', productRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


