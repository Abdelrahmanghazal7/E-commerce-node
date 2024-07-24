import { Router } from "express";
import * as subCategories from "./subCategory.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addSubCategory, updateSubCategory } from "./subCategory.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { multerHost, validExtension } from "../../service/multer.js";

const subCategoryRouter = Router({mergeParams: true});

subCategoryRouter.post("/", auth(systemRoles.admin), multerHost(validExtension.image).single("image"), validation(addSubCategory), subCategories.addSubCategory);

subCategoryRouter.put("/:id", auth(systemRoles.admin), multerHost(validExtension.image).single("image"), validation(updateSubCategory), subCategories.updateSubCategory);

subCategoryRouter.get("/", auth(Object.values(systemRoles)), subCategories.getSubCategories);

export default subCategoryRouter;
