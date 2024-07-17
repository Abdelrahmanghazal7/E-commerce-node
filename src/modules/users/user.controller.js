import userModel from "../../../db/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../service/sendEmail.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";

// =========================================== SIGN UP ===========================================

const registration = async (req, res, next) => {
  const { name, email, password, cPassword, age, phone, address } = req.body;

  // Check if the user already exists
  const userExist = await userModel.findOne({ email: email.toLowerCase() });

  userExist && next(new AppError("user already exist", 400));

  const token = jwt.sign({ email }, "generateTokenSecret", {
    expiresIn: 60 * 2,
  });
  const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;

  const rftoken = jwt.sign({ email }, "generateRefreshTokenSecret", {
    expiresIn: 60 * 2,
  });
  const rflink = `${req.protocol}://${req.headers.host}/users/RefreshToken/${rftoken}`;

  const checkSendEmail = await sendEmail(
    email,
    "verify your email",
    `<a href=${link}>click here</a> <br> <a href=${rflink}>click here to resend the link</a>`
  );

  if (!checkSendEmail) {
    return next(new AppError("email not send", 400));
  }

  // Hash the password
  const hash = bcrypt.hashSync(password, 10);

  // Create a new user
  const user = new userModel({
    name,
    email,
    password: hash,
    cPassword,
    age,
    phone,
    address,
  });
  const newUser = await user.save();

  newUser
    ? res.status(201).json({ msg: "done", user: newUser })
    : next(new AppError("user not created", 500));
};

export const signUp = asyncHandler(registration);

// =========================================== VERIFY EMAIL ===========================================

const confirm = async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, "generateTokenSecret");
  if (!decoded?.email) return next(new AppError("invalid token", 400));

  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true },
    { new: true }
  );

  user
    ? res.status(201).json({ msg: "done" })
    : next(new AppError("user not found or already confirmed", 400));
};

export const confirmEmail = asyncHandler(confirm);

// =========================================== REFRESH TOKEN ===========================================

const refresh = async (req, res, next) => {
  const { rfToken } = req.params;
  const decoded = jwt.verify(rfToken, process.env.JWT_SECRET);
  if (!decoded?.email) return next(new AppError("invalid token", 400));

  const user = await userModel.findOne({
    email: decoded.email,
    confirmed: true,
  });

  if (user) {
    return next(new AppError("user already confirmed", 400));
  }

  const token = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET);
  const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;

  await sendEmail(
    decoded.email,
    "verify your email",
    `<a href=${link}>click here</a>`
  );
  res.status(200).json({ msg: "done" });
};

export const refreshToken = asyncHandler(refresh);

// =========================================== FORGET PASSWORD ===========================================

const forget = async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new AppError("user not exist", 400));
  }

  const code = customAlphabet("0123456789", 5);
  const newCode = code();

  await sendEmail(
    email,
    "code for reset password",
    `<h1>your code is ${newCode}</h1>`
  );
  await userModel.updateOne({ email }, { code: newCode });

  res.status(200).json({ msg: "done" });
};

export const forgetPassword = asyncHandler(forget);

// =========================================== RESET PASSWORD ===========================================

const reset = async (req, res, next) => {
  const { email, code, password } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new AppError("user not exist", 400));
  }

  if (user.code !== code || code == "") {
    return next(new AppError("invalid code", 400));
  }

  const hash = bcrypt.hashSync(password, 5);

  await userModel.updateOne({ email }, { password: hash, code: "", passwordChangeAt: Date.now() });

  res.status(200).json({ msg: "done" });
};

export const resetPassword = asyncHandler(reset);

// =========================================== SIGN IN ===========================================

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email: email.toLowerCase(),
    confirmed: true,
  });

  // Check if user exist
  if (!user) {
    return next(new AppError("invaild user", 409));
  }

  // Compare passwords
  if (!bcrypt.compareSync(password, user.password)) {
    return next(new AppError("password incorrect", 400));
  }

  // Generate JWT token
  const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  await userModel.updateOne({ email }, { loggedIn: true });

  res.status(200).json({ token });
};

export const signIn = asyncHandler(login);
