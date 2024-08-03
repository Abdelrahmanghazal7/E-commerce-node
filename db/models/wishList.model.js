import { Schema, Types, model } from "mongoose";

const wishListSchema = Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        type: Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const wishListModel = model("wishList", wishListSchema);

export default wishListModel;
