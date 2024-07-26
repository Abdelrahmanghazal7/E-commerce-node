import joi from "joi";
import {generalFields} from "../../utils/generalFields.js"

export const addReview = {
  body: joi.object({
    comment: joi.string().required(),
    rate: joi.number().min(1).max(5).integer().required(),
  }),
  params: joi.object({
    productId: generalFields.id.required()
  }),
  headers: generalFields.headers.required(),
};

export const deleteReview = {
  params: joi.object({
    id: generalFields.id.required()
  }),
  headers: generalFields.headers.required(),
};
