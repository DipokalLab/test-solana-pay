import { Request, Response, NextFunction } from "express";

const testController = {
  create: async function (req: Request, res: Response) {
    res.status(200).send({
      test: "",
    });
  },
};

export { testController };
