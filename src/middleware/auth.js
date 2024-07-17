import userModel from "../../db/models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/globalErrorHandling.js";

export const auth = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
      return res.status(400).json({ msg: "token not exist" });
    }

    if (!token.startsWith("ghazal__")) {
      return res.status(400).json({ msg: "invalid bearer key" });
    }

    const newToken = token.split("ghazal__")[1];
    if (!newToken) {
      return res.status(400).json({ msg: "invalid token" });
    }

    const decoded = jwt.verify(newToken, process.env.JWT_SECRET);
    if (!decoded?.email) {
      return res.status(400).json({ msg: "invalid token payload" });
    }

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(409).json({ msg: "user not exist" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ msg: "not authorized" });
    }

    if (parseInt(user.passwordChangeAt.getTime() / 1000) > decoded.iat) {
      return res.status(409).json({ msg: "token expired please login again" });
    }

    req.user = user;
    next();
  });
};
