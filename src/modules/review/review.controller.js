import reviewModel from "../../../db/models/review.model.js";
import productModel from "../../../db/models/product.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";

// =========================================== addreview ===========================================

export const addReview = asyncHandler(async (req, res, next) => {
  const { comment, rate } = req.body;
  const { productId } = req.params;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("product not found", 404));
  }

  const reviewExist = await reviewModel.findOne({
    createdBy: req.user._id,
    productId,
  });
  if (reviewExist) {
    return next(new AppError("you are already reviewed", 400));
  }

  const order = await orderModel.findOne({
    user: req.user._id,
    "products.productId": productId,
    status: "delivered",
  });

  if (!order) {
    return next(new AppError("order not found", 404));
  }

  const review = await reviewModel.create({
    comment,
    rate,
    productId,
    createdBy: req.user._id,
  });

  let sum = product.rateAvg * product.rateNum;
  sum = sum * rate;

  product.rateAvg = sum / (product.rateNum + 1);
  product.rateNum += 1;

  await product.save();

  res.status(201).json({ msg: "done", review });
});

// =========================================== deletereview ===========================================

export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await reviewModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });

  if (!review) {
    return next(new AppError("review not found", 404));
  }

  const product = await productModel.findById(review.productId);

  let sum = product.rateAvg * product.rateNum;
  sum = sum - review.rate;

  product.rateAvg = sum / (product.rateNum - 1);
  product.rateNum -= 1;

  await product.save();

  res.status(201).json({ msg: "done", review });
});
