import { Request, Response } from "express";
import User from "../models/user.model";

const verifyToken = (req: Request, res: Response, next: any) => {
    const token: string = req.headers.token?.toString() || '';

    if (req.headers['user-id']) {
        req.headers.userId = req.headers['user-id'];
        req.headers.schoolId = req.headers['school-id'];
        req.headers.email = req.headers['email'];
        return next();
    }

    if (!token) {
        return res.status(401).send({
            message: "No token provided!",
        });
    }

    const info = User.verifyToken(token);

    if (info === null) {
        return res.status(401).send({
            message: "Unauthorized!",
        });
    }

    req.headers.userId = info.userId.toString();
    req.headers.schoolId = info.schoolId?.toString();
    req.headers.email = info.email;
    next();

};

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

export = AuthJwt;
