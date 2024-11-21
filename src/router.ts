import errorHandleController from "./middlewares/errorHandler.js";

import { Router } from "express";
import { paymentController } from "./controllers/paymentController.js";

const router = Router();

router.get("/", function (res, req) {
  req.send({
    serverName: "test",
  });
});

router.post("/payment/create", errorHandleController(paymentController.create));
router.post(
  "/payment/process",
  errorHandleController(paymentController.process)
);
router.post("/payment/verify", errorHandleController(paymentController.verify));

export default router;
