import { Schema, Types, model } from "mongoose";

const reviewSchema = Schema(
  {
    comment: {
      type: String,
      required: [true, "comment is required"],
      minLength: 3,
      trim: true,
    },
    rate: {
      type: Number,
      required: [true, "rate is required"],
      min: 1,
      max: 5,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const reviewModel = model("review", reviewSchema);

export default reviewModel;
