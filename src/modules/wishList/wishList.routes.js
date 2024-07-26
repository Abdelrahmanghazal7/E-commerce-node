import { Router } from "express";
import * as wishLists from "./wishList.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addWishList } from "./wishList.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const wishListRouter = Router({mergeParams: true});

wishListRouter.post("/", auth(Object.values(systemRoles)), validation(addWishList), wishLists.addWishList);

export default wishListRouter;
