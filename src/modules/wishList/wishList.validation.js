import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const addWishList = {
  params: joi.object({
    productId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};
