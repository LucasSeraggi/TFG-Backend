import { Request, Response } from "express";
import { News } from '../models/news.model';

const find = async (req: Request, res: Response) => {
    try {
        const news = await News.find(Number(req.query.subjectId));
        if (news == null) {
            return res.status(404).json({
                message: 'Resource not found',
            });
        }
        return res.status(200).json(news);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err,
        });
    }
}

const register = async (req: Request, res: Response) => {
    try {
        const addNews = new News({
            title: req.body.title,
            description: req.body.description,
            schoolId: req.body.schoolId,
            subjectId: req.body.subjectId,
            classId: req.body.classId,
        });
        await addNews.save();
        return res.status(200).json({
            success: true,
            message: 'News added successfully'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err,
        });
    }
}

const newsController = { find, register }

export = newsController;