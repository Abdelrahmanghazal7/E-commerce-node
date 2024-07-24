import { Router } from "express";
import * as subCategories from "./brand.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addBrand, updateBrand } from "./brand.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { multerHost, validExtension } from "../../service/multer.js";

const router = Router();

router.post("/", auth(systemRoles.admin), multerHost(validExtension.image).single("image"), validation(addBrand), subCategories.addBrand);

router.put("/:id", auth(systemRoles.admin), multerHost(validExtension.image).single("image"), validation(updateBrand), subCategories.updateBrand);

export default router;
