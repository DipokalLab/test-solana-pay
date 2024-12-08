import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const testController = {
  create: async function (req: Request, res: Response) {
    console.log(process.env.RPC_ENDPOINT);

    res.status(200).send({
      test: "",
    });
  },
};

export { testController };
