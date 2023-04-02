import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserJwt } from "../interface/user.interface";

const SECRET = process.env.JWT_SECRET || "secret";

const verifyToken = (req: Request, res: Response, next: any) => {
    const token: string = req.headers.authorization || '';

    if (req.headers['user-id']) {
        req.headers.userId = req.headers['user-id'];
        req.headers.schoolId = req.headers['school-id'];
        return next();
    }

    if (!token) {
        return res.status(401).send({
            message: "No token provided!",
        });
    }

    const info = jwt.verify(token, SECRET) as UserJwt;
    const lastTimeOk = (Date.now() / 1000) - (3600 * 3); // 3 horas

    if (!info || !info.iat || info.iat < lastTimeOk) {
        return res.status(401).send({
            message: "Unauthorized!",
        });
    }
    console.log(info);

    req.headers.userId = info.userId?.toString();
    req.headers.schoolId = info.schoolId?.toString();
    req.headers.iat = info.iat?.toString();
    req.headers.email = info.email;

    return next();
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
};

export = AuthJwt;
