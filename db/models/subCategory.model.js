import { Schema, Types, model } from "mongoose";

const subCategorySchema = Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 30,
      lowercase: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
      unique: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
      required: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    customId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const subCategoryModel = model("subCategory", subCategorySchema);

export default subCategoryModel;
