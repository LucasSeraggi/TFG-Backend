import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// export = (req: Request, res: Response, next: any) => {
//     try {
//         const token: string = req.headers.authorization?.replace('Bearer ', '') || '';
//         console.log(token);

//         const decoded = jwt.verify(token, 'secret').toString();
//         req.headers.userData = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: 'Falha na autenticação!' });
//     }
// };


const verifyToken = (req: Request, res: Response, next: any) => {
    let token: string = req.headers.token?.toString() || '';

    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err || decoded === undefined || decoded === null || decoded === "") {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }

        req.headers.userId = decoded.toString();
        next();
    });
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
