import { Router } from "express";
import * as reviews from "./review.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addReview, deleteReview } from "./review.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.post(
  "/:productId",
  auth(Object.values(systemRoles)),
  validation(addReview),
  reviews.addReview
);

reviewRouter.delete(
  "/:id",
  auth(Object.values(systemRoles)),
  validation(deleteReview),
  reviews.deleteReview
);

export default reviewRouter;
