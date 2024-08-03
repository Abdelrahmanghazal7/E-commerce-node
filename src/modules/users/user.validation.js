import joi from "joi";

export const signUpValidation = {
  body: joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.ref("password"),
    age: joi.number().integer().required(),
    phone: joi.number().integer().required(),
    address: joi.string().required(),
  }),
};

export const signInValidation = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/))
      .required(),
  }),
};
