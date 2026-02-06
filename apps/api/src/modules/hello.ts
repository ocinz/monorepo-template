import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth.js";

export const helloRoute = new Hono().get("/", authMiddleware, async (c) => {
  return c.json("Hello Honooooo");
});
