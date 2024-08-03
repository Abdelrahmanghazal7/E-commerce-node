import express from "express";
import * as orders from "./order.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addOrder, cancelOrder } from "./order.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const orderRouter = express.Router({ mergeParams: true });

orderRouter.post(
  "/",
  auth(Object.values(systemRoles)),
  validation(addOrder),
  orders.addOrder
);

orderRouter.put(
  "/:id",
  auth(Object.values(systemRoles)),
  validation(cancelOrder),
  orders.cancelOrder
);

orderRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  orders.webhook
);

export default orderRouter;
