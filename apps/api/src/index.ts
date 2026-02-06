import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prisma } from "./utils/prisma.js";
import "dotenv/config";

const app = new Hono()
  .get("/", (c) => {
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
