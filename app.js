import express from "express";
import api from "./dist/router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Router } from "express";

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", api);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    msg: "500",
  });
});

const server = app.listen(8000, (err) => {
  console.log(`[ + ] The server is running.`);
});
