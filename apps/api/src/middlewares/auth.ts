import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { Jwt } from "hono/utils/jwt";

export const authMiddleware = createMiddleware(async (c, next) => {
  const bearer = c.req.header("Authorization");

  if (!bearer?.startsWith("Bearer")) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  const token = bearer.split(" ")[1];

  try {
    const payload = await Jwt.verify(token, "aaaaa", "HS256");
    c.set("jwtPayload", payload);
  } catch {
    throw new HTTPException(401, { message: "Token expired" });
  }
  await next();
});
