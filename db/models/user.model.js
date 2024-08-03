import { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 15,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    phone: [String],
    address: [String],
    confirmed: {
      type: Boolean,
      default: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    role: { type: String, enum: Object.values(systemRoles), default: "user" },
    passwordChangeAt: Date,
    code: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userModel = model("user", userSchema);

export default userModel;
