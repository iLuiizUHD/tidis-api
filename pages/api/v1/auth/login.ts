import express from "express";
import { NextApiRequest, NextApiResponse } from "next";
import helmet from "helmet";
import cors from "cors";
import * as yup from "yup";

const app = express();

app.use(helmet());
app.use(
  cors({
    allowedHeaders: ["GET", "POST"],
    origin: process.env.NODE_ENV === "production" ? "tidis.net" : "*",
  })
);

app.disable("x-powered-by");

const loginBody = yup.object().shape({
  provider: yup
    .string()
    .trim()
    .required("The provider is not a valid provider!")
    .oneOf(["google", "twitter", "facebook", "github"]),
});

app.post("/v1/auth/login", async (req, res) => {
  const { body } = req;

  try {
    await loginBody.validate(body);
  } catch (error) {
    res.status(401).json({ error });
    return false;
  }

  res.json({ success: true, ...body });

  //
});

export default (req: NextApiRequest, res: NextApiResponse) => app(req, res);
