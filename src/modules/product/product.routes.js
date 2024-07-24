import { Router } from "express";
import * as products from "./product.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addProduct } from "./product.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { multerHost, validExtension } from "../../service/multer.js";

const productRouter = Router({mergeParams: true});

productRouter.post("/", auth(systemRoles.admin), multerHost(validExtension.image).fields([
    {name: "image", maxCount: 1},
    {name: "coverImages", maxCount: 3}
]), validation(addProduct), products.addProduct);

export default productRouter;
