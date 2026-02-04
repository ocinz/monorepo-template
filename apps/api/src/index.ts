import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prisma } from "./utils/prisma.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.get("/user", async (c) => {
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
