import multer from "multer";
import { AppError } from "../utils/classError.js";


export const validExtension = {
  image:["image/jpg", "image/png", "image/jpge"]
}


export const multerHost = (customValidation) => {
 
  const storage = multer.diskStorage({});

  const fileFilter = function (req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new AppError("file not supported"), false);
  };

  const upload = multer({ fileFilter, storage });
  return upload;
};
