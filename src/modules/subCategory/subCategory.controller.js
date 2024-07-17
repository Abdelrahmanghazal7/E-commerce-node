import categoryModel from "../../../db/models/category.model.js";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "./cloudinary/cloudinary.js";
import {nanoid} from "nanoid";
import slugify from "slugify";

// =========================================== addSubCategory ===========================================

const addS = async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  // Check if the category exists
  const categoryExist = await categoryModel.findById(categoryId);
  categoryExist && next(new AppError("category already exist", 400));

    // Check if the subCategory already exists
  const subCategoryExist = await subCategoryModel.findOne({ name: name.toLowerCase() });
  subCategoryExist && next(new AppError("subCategory already exist", 400));

  if (!req.file) {
    return next(new AppError("image is required", 404)); 
  }

  const customId = nanoid(5)
  const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
folder: `EcommerceC42/categories/${categoryExist.customId}/subCategory/${customId}`
  })

  // Create a new subCategory
  const newSubCategory = await subCategoryModel.create({
    name,
    slug: slugify(name, {
      replacement:"_",
      lower: true
    }),
    image:{secure_url, public_id},
    customId,
    categoryId,
    createdBy: req.user._id
  });

  newSubCategory ? res.status(201).json({ msg: "done", subCategory: newSubCategory })
    : next(new AppError("subCategory not created", 500));
};

export const addSubCategory = asyncHandler(addS);


// =========================================== updateSubCategory ===========================================

const updateS = async (req, res, next) => {

  const { name, category } = req.body;
  const { id } = req.params;

    // Check if the category exists
    const categoryExist = await categoryModel.findById(category);
    categoryExist && next(new AppError("category already exist", 400));
  
  // Check if the subCategory already exists
  const subCategory = await subCategoryModel.findOne({_id: id, createdBy: req.user._id});
  subCategory && next(new AppError("subCategory already exist", 400));

  if (name) {
    if (name.toLowerCase() === subCategory.name) {
      return next(new AppError("name should be different", 400));
    }
    if (await subCategoryModel.findOne({name: name.toLowerCase()})) {
      return next(new AppError("name already exist", 409));
    }
    subCategory.name = name.toLowerCase()
    subCategory.slug = slugify(name, {
      replacement: "_",
      lower: true
    })
  }

  if (req.file) {
    await cloudinary.uploader.destroy(subCategory.image.public_id)
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
  folder: `EcommerceC42/categories/${categoryExist.customId}/subCategory/${subCategory.customId}`
    }) 
  subCategory.image = { secure_url, public_id}
  }

  await subCategory.save()
  return res.status(200).json({msg: "done", subCategory})
}

export const updateSubCategory = asyncHandler(updateS);
