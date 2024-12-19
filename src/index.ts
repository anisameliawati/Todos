import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import userRouter from "../src/routes/user.routes";
import checklistRouter from "../src/routes/check-list.routes";
import itemRouter from "../src/routes/item.route";
import subItemRouter from "../src/routes/sub-item.routes";

config();

export const prisma = new PrismaClient();
export const secretKey = String(process.env.secretKey);

const app: Application = express();
const PORT = process.env.PORT;
const path = "/api/todos";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes

app.use(path, userRouter);
app.use(path, checklistRouter);
app.use(path, itemRouter);
app.use(path, subItemRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: error.message || "internal server error" });
}); //error handler

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("page not found"); //page not found handler
});

app.listen(PORT, () => {
  console.log("api is running on port", PORT);
});
