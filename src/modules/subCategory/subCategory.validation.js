import joi from "joi";
import {generalFields} from "../../utils/generalFields.js"

export const addSubCategory = {
  body: joi.object({
    name: joi.string().min(3).max(100).required(),
  }).required(),
  file: generalFields.file.required(),
  params: joi.object({categoryId: generalFields.id.required()}),
  headers: generalFields.headers.required(),
};

export const updateSubCategory = {
  body: joi.object({
    name: joi.string().min(3).max(100),
  }).required(),
  file: generalFields.file,
  params: joi.object({categoryId: generalFields.id.required()}),
  headers: generalFields.headers.required(),
};
