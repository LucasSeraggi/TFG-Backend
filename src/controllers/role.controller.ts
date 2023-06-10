import Role from '../models/role.model';
import { Request, Response } from "express";

const listRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.list();
        res.status(200).json({
            success: true,
            message: roles.rows
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: ({ err: err })
        });
    }
}

const RoleController = {listRoles};

export = RoleController;
