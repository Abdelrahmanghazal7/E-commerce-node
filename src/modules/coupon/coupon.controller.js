import couponModel from "../../../db/models/coupon.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";

// =========================================== addCoupon ===========================================

export const addCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;

  // Check if the coupon already exist
  const couponExist = await couponModel.findOne({ code: code.toLowerCase() });
  if (!couponExist) {
    return next(new AppError("coupon already exist", 409));
  }

  // Create a new subcoupon
  const coupon = await couponModel.create({
    code,
    amount,
    fromDate,
    toDate,
    createdBy: req.user._id,
  });

  res.status(201).json({ msg: "done", coupon });
});

// =========================================== updateCoupon ===========================================

export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { code, amount, fromDate, toDate } = req.body;

  const couponExist = await couponModel.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    { code, amount, fromDate, toDate },
    { new: true }
  );

  if (!couponExist) {
    return next(
      new AppError("coupon not exist or you don't have permission", 409)
    );
  }

  res.status(200).json({ msg: "done", coupon });
});
