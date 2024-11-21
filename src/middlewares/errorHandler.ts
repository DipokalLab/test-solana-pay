import { Request, Response, NextFunction } from "express";

const errorHandleController = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default errorHandleController;
