import joi from "joi";
import {generalFields} from "../../utils/generalFields.js"

export const addOrder = {
  body: joi.object({
    productId: generalFields.id,
    quantity: joi.number().integer(),
    phone: joi.string().required(),
    address: joi.string().required(),
    couponCode: joi.string().min(3),
    paymentMethod: joi.string().valid("card", "cash").required(),
  }),
  headers: generalFields.headers.required(),
};
