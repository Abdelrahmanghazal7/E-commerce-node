import { Router } from "express";
import * as subCategories from "./subCategory.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addSubCategory, updateSubCategory } from "./subCategory.validation.js";
import { multerHost, validExtension } from "./cloudinary/multer.js";

const subCategoryRouter = Router({mergeParams: true});

subCategoryRouter.post("/", auth(["admin"]), multerHost(validExtension.image).single("image"), validation(addSubCategory), subCategories.addSubCategory);

subCategoryRouter.put("/:id", auth(["admin"]), multerHost(validExtension.image).single("image"), validation(updateSubCategory), subCategories.updateSubCategory);

export default subCategoryRouter;
