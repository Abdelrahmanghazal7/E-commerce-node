import joi from "joi";
import {generalFields} from "../../utils/generalFields.js"

export const addBrand = {
  body: joi.object({
    name: joi.string().min(3).max(100).required(),
  }).required(),
  file: generalFields.file.required(),
  headers: generalFields.headers.required(),
};

export const updateBrand = {
  body: joi.object({
    name: joi.string().min(3).max(100),
  }).required(),
  file: generalFields.file,
  headers: generalFields.headers.required(),
};
