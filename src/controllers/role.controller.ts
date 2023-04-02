import Role from '../models/role.model';
import { Request, Response } from "express";

const listRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.list();
        res.status(200).send({
            success: true,
            message: roles.rows
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            message: ({ err: err })
        });
    }
}

const RoleController = {listRoles};

export = RoleController;
