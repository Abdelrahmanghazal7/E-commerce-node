import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "./cloudinary/cloudinary.js";
import {nanoid} from "nanoid";
import slugify from "slugify";

// =========================================== addCategory ===========================================

const addC = async (req, res, next) => {
  const { name } = req.body;

  // Check if the category already exists
  const categoryExist = await categoryModel.findOne({ name: name.toLowerCase() });

  categoryExist && next(new AppError("category already exist", 400));

  if (!req.file) {
    return next(new AppError("image is required", 404)); 
  }

  const customId = nanoid(5)
  const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
folder: `EcommerceC42/categories/${customId}`
  })

  // Create a new category
  const newCategory = await categoryModel.create({
    name,
    slug: slugify(name, {
      replacement:"_",
      lower: true
    }),
    image:{secure_url, public_id},
    customId,
    createdBy: req.user._id
  });

  newCategory ? res.status(201).json({ msg: "done", category: newCategory })
    : next(new AppError("category not created", 500));
};

export const addCategory = asyncHandler(addC);


// =========================================== updateCategory ===========================================

const updateC = async (req, res, next) => {

  const { name } = req.body;
  const { id } = req.params;

  // Check if the category already exists
  const category = await categoryModel.findOne({_id: id, createdBy: req.user._id});

  category && next(new AppError("category already exist", 400));

  if (name) {
    if (name.toLowerCase() === category.name) {
      return next(new AppError("name should be different", 400));
    }
    if (await categoryModel.findOne({name: name.toLowerCase()})) {
      return next(new AppError("name already exist", 409));
    }
    category.name = name.toLowerCase()
    category.slug = slugify(name, {
      replacement: "_",
      lower: true
    })
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id)
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
  folder: `EcommerceC42/categories/${category.customId}`
    }) 
  category.image = { secure_url, public_id}
  }

  await category.save()
  return res.status(200).json({msg: "done", category})
}

export const updateCategory = asyncHandler(updateC);
