import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middlewares/auth.js";
import { authRoute } from "./modules/auth.js";
import { prisma } from "./utils/prisma.js";

const app = new Hono()
  .use(logger())
  .use(cors())
  .route("/auth", authRoute)
  .use(authMiddleware)
  .get("/", (c) => {
    const payload = c.get("jwtPayload");
    console.log({ yow: payload });

    return c.text("Hello Hono!");
  })
  .get("/users", async (c) => {
    const users = await prisma.user.findMany();
    return c.json({ users });
  });
serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
export type BackendType = typeof app;
