import { Router } from "express";
import * as coupons from "./coupon.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addCoupon, updateCoupon } from "./coupon.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const couponRouter = Router({mergeParams: true});

couponRouter.post("/", auth(systemRoles.admin), validation(addCoupon), coupons.addCoupon);

couponRouter.put("/:id", auth(systemRoles.admin), validation(updateCoupon), coupons.updateCoupon);

export default couponRouter;
