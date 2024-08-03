import { Router } from "express";
import * as orders from "./order.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addOrder, cancelOrder } from "./order.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const orderRouter = Router({ mergeParams: true });

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

export default orderRouter;
