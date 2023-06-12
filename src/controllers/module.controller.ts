import { Request, Response } from "express";
import { Module } from "../models/module.model";

const find = async (req: Request, res: Response) => {
  try {
    const modules = await Module.find(Number(req.query.subjectId));
    if (modules == null) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }
    return res.status(200).json(modules);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const addModule = new Module({
      title: req.body.title,
      description: req.body.description,
      subjectId: req.body.subjectId,
      content: req.body.content,
      ordenation: req.body.ordenation,
    });
    await addModule.save();
    return res.status(200).json({
      success: true,
      message: "Module added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const rowRemoved = await Module.remove(Number(req.query.id));

    if (rowRemoved == 0) {
      return res.status(404).send({
        message: "Subject not found.",
      });
    }
    return res.status(200).send({
      message: "Module removed successfully.",
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err,
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    if (!req.body.id)
      return res.status(400).send({ message: "Module id is required." });

    const rowUpdated = await Module.update({
      id: Number(req.body.id),
      title: req.body.title?.toString(),
      description: req.body.description?.toString(),
      content: req.body.content
        ? JSON.stringify(req.body.content).replace(/\\/g, "").slice(1, -1)
        : undefined,
      ordenation: req.body.ordenation ? Number(req.body.ordenation) : undefined,
    });

    if (rowUpdated == 0) {
      return res.status(404).send({
        message: "Module not found.",
      });
    }
    res.status(200).send({
      message: "Module updated successfully.",
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err,
    });
  }
};

const moduleController = { find, register, remove, update };

export = moduleController;
