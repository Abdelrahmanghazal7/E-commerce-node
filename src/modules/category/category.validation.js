import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const addCategory = {
  body: joi.object({
    name: joi.string().min(3).max(100).required(),
  }),
  file: generalFields.file.required(),
  headers: generalFields.headers.required(),
};

export const updateCategory = {
  body: joi.object({
    name: joi.string().min(3).max(100),
  }),
  file: generalFields.file,
  headers: generalFields.headers.required(),
};
