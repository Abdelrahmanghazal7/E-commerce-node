import { Router } from "express";
import * as users from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { signInValidation, signUpValidation } from "./user.validation.js";

const router = Router();

router.post("/signUp", validation(signUpValidation), users.signUp);

router.get("/verifyEmail/:token", users.confirmEmail);

router.get("/refreshToken/:rfToken", users.refreshToken);

router.patch("/sendCode", users.forgetPassword);

router.patch("/resetPassword", users.resetPassword);

router.post("/signIn", validation(signInValidation), users.signIn);

export default router;
