const dataMethod = ["body", "query", "params", "header", "file", "files"];

export const validation = (schema) => {
  return (req, res, next) => {
    let arrayError = [];
    dataMethod.forEach((key) => {
      if (schema[key]) {
        const { error } = schema[key].validate(req.body, { abortEarly: false });
        if (error?.details) {
          error.details.forEach((err) => {
            arrayError.push(err.message);
          });
        }
      }
    });

    if (arrayError.length) {
      return res
        .status(400)
        .json({ msg: "validation error", errors: arrayError });
    }

    next();
  };
};
