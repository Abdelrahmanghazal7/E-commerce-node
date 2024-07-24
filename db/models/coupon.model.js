import { Schema, Types, model } from "mongoose";

const couponSchema = Schema(
  {
    code: {
      type: String,
      required: [true, "code is required"],
      minLength: 3,
      maxLength: 30,
      lowercase: true,
      trim: true,
      unique: true
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      minLength: 1,
      maxLength: 100,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true
    },
    usedBy: [{
      type: Types.ObjectId,
      ref: "user",
    }],
    fromDate: {
      type: Date,
      required: [true, "fromDate is required"],
    },
    toDate: {
      type: Date,
      required: [true, "toDate is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const couponModel = model("coupon", couponSchema);

export default couponModel;
