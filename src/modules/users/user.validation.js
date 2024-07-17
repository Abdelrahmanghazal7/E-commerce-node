import joi from "joi";

export const signUpValidation = {
  body: joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    recoveryEmail: joi.string(),
    DOB: joi.date().iso().required(),
    mobileNumber: joi.number(),
    role: joi.string().valid('User', 'Company_HR').required(),
    status: joi.string().valid('online', 'offline')
  }),
};

export const signInValidation = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      )
      .required(),
  }),
};
