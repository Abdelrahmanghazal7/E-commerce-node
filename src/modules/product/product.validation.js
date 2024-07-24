import joi from "joi";
import {generalFields} from "../../utils/generalFields.js"

export const addProduct = {
  body: joi.object({
    title: joi.string().min(3).max(30).required(),
    stock: joi.number().min(1).integer().required(),
    discount: joi.number().min(1).max(100),
    price: joi.number().min(1).integer().required(),
    brand: generalFields.id.required(),
    subCategory: generalFields.id.required(),
    category: generalFields.id.required(),
    description: joi.string(),
  }),
  file: joi.object({
    image: joi.array().items(generalFields.file.required()).required(),
    coverImages: joi.array().items(generalFields.file.required()).required(),
  }),
  headers: generalFields.headers.required(),
};