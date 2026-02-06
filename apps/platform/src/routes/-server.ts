import { hc } from "hono/client";
import type { BackendType } from "../../../api/src/index";

export const api = hc<BackendType>("http://localhost:8000");
