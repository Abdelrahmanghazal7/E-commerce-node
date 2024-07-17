import { Router } from "express";
import * as categories from "./category.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addCategory, updateCategory } from "./category.validation.js";
import { multerHost, validExtension } from "./cloudinary/multer.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";

const categoryRouter = Router();

categoryRouter.use("/:categoryId/subCategories", subCategoryRouter)

categoryRouter.post("/", auth(["admin"]), multerHost(validExtension.image).single("image"), validation(addCategory), categories.addCategory);

categoryRouter.put("/:id", auth(["admin"]), multerHost(validExtension.image).single("image"), validation(updateCategory), categories.updateCategory);

export default categoryRouter;
