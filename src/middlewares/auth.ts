import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from 'bcryptjs';

const verifyToken = (req: Request, res: Response, next: any) => {
    const token: string = req.headers.authorization?.toString() || '';

    if (req.headers['user-id']) {
        req.headers.userId = req.headers['user-id'];
        req.headers.schoolId = req.headers['school-id'];
        return next();
    }

    if (!token) {
        res.status(401).send({
            message: "No token provided!",
        });
        return false;
    }

    const info = User.verifyToken(token);

    if (info === null) {
        res.status(401).send({
            message: "Unauthorized!",
        });
        return false;
    }
    
    req.headers.userId = info.userId.toString();
    req.headers.schoolId = info.schoolId?.toString();
    req.headers.email = info.email;
    
    return true;
};

const validatePass = async (password: string, hash: string) => {
    return await bcrypt.compareSync(password, hash); 
}

// const isAdmin = async (req: Request, res: Response, next: any) => {
//     try {
//         const user = await User.findByPk(req.userId);
//         const roles = await user.getRoles();

//         for (let i = 0; i < roles.length; i++) {
//             if (roles[i].name === "admin") {
//                 return next();
//             }
//         }

//         return res.status(403).send({
//             message: "Require Admin Role!",
//         });
//     } catch (error) {
//         return res.status(500).send({
//             message: "Unable to validate User role!",
//         });
//     }
// };



const AuthJwt = {
    verifyToken,
    // isAdmin,
};

export = { AuthJwt, validatePass, verifyToken };
