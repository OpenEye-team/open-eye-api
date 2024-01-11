import { Router } from "express";
import { Server } from "socket.io";

import auth from "./api/auth";
import glucometer from "./api/glucometer";
import article from "./api/article";

const dataRoutes = (io: Server) => {
  const router = Router();
  router.use("/auth", auth);
  router.use("/glucometer", glucometer);
  router.use("/article", article);
  return router;
}
export default dataRoutes;