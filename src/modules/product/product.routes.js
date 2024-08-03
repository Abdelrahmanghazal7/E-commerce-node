import { Router } from "express";
import * as products from "./product.controller.js";
import reviewRouter from "../review/review.routes.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addProduct, updateProduct } from "./product.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { multerHost, validExtension } from "../../service/multer.js";

const productRouter = Router({ mergeParams: true });

productRouter.use("/:productId/reviews", reviewRouter);

productRouter.post(
  "/",
  auth(systemRoles.admin),
  multerHost(validExtension.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
  ]),
  validation(addProduct),
  products.addProduct
);

productRouter.get("/", auth(Object.values(systemRoles)), products.getProducts);

productRouter.put(
  "/:id",
  auth(systemRoles.admin),
  multerHost(validExtension.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
  ]),
  validation(updateProduct),
  products.updateProduct
);

export default productRouter;
