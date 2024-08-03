import { Router } from "express";
import * as categories from "./category.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addCategory, updateCategory } from "./category.validation.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { multerHost, validExtension } from "../../service/multer.js";

const categoryRouter = Router();

categoryRouter.use("/:categoryId/subCategories", subCategoryRouter);

categoryRouter.post(
  "/",
  auth(systemRoles.admin),
  multerHost(validExtension.image).single("image"),
  validation(addCategory),
  categories.addCategory
);

categoryRouter.put(
  "/:id",
  auth(systemRoles.admin),
  multerHost(validExtension.image).single("image"),
  validation(updateCategory),
  categories.updateCategory
);

categoryRouter.get(
  "/",
  auth(Object.values(systemRoles)),
  categories.getCategories
);

categoryRouter.delete(
  "/:id",
  auth(systemRoles.admin),
  categories.deleteCategory
);

export default categoryRouter;
