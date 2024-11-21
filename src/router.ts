import { Router } from "express";
import errorHandleController from "./middlewares/errorHandler";

const router = Router();

router.get("/", function (res, req) {
  req.send({
    serverName: "test",
  });
});

export default router;
