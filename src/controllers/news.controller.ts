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

const update = async (req: Request, res: Response) => {
    try {
  
      if (!req.body.id)
        return res.status(500).json({ message: 'News id is required.' });
  
      if (req.body.schoolId && req.body.schoolId?.toString() != req.headers.schoolId?.toString())
        return res.status(401).json({ message: 'School id not match with news.' });
  
      const newsUpdated = new News({
        id: Number(req.body.id),
        schoolId: Number(req.headers.schoolId),
  
        classId: req.body.class_id,
        title: req.body.title,
        description: req.body.description,
        subjectId: req.body.subject_id,
      });
  
      const rowsUpdate = await newsUpdated.update();
      if (rowsUpdate === 0) {
        return res.status(404).json({
          message: 'News not found.'
        });
      }
  
      res.status(200).json({
        message: 'News updated successfully.'
      });
    } catch (err) {
      res.status(500).json({
        message: err
      });
    }
  };

const remove = async (req: Request, res: Response) => {
    try {
      const rowRemoved = await News.remove(
        Number(req.params.id),
        Number(req.headers.schoolId)
      );
  
      if (rowRemoved === 0) {
        return res.status(404).json({
          message: 'News not found.'
        });
      }
      return res.status(200).json({
        message: 'News removed successfully.'
      });
    } catch (err) {
      res.status(500).json({
        message: err
      })
    }
};

const newsController = { find, register, remove, update }

export = newsController;