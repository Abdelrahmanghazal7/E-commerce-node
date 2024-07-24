import { Router } from "express";
import * as carts from "./cart.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addCart, clearCart, removeCart } from "./cart.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const cartRouter = Router({mergeParams: true});

cartRouter.post("/", auth(Object.values(systemRoles)), validation(addCart), carts.addCart);

cartRouter.patch("/", auth(systemRoles.admin), validation(removeCart), carts.removeCart);

cartRouter.put("/", auth(systemRoles.admin), validation(clearCart), carts.clearCart);

export default cartRouter;
