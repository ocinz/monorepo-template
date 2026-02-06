import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Jwt } from "hono/utils/jwt";
import z from "zod";
import { prisma } from "../utils/prisma.js";

const schema = z.object({
  email: z.email(),
  password: z.string(),
  confirm_password: z.string(),
  username: z.string(),
  name: z.string(),
});
const registerSchema = schema.refine(
  (data) => data.password === data.confirm_password,
  {
    error: "Password tidak sama",
    path: ["confirm_password"],
  },
);

const loginSchema = schema.pick({
  email: true,
  password: true,
});
export const authRoute = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const data = c.req.valid("json");

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: data.email,
      },
    });
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new HTTPException(401);
    }
    const token = await Jwt.sign(
      {
        sub: { id: user.id, email: user.email, username: user.username },
        exp: Math.floor(Date.now() / 1000) + 60 * 5,
      },
      "aaaaa",
      "HS256",
    );

    return c.json({ user, token });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const data = c.req.valid("json");
    const { confirm_password, ...userData } = data;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await prisma.user.create({
      data: { ...userData, password: hashedPassword },
      select: {
        username: true,
        email: true,
      },
    });

    return c.status(201);
  });
