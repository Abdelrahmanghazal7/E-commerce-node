import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../service/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";

// =========================================== addCategory ===========================================

export const addCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Check if the category already exists
  const categoryExist = await categoryModel.findOne({
    name: name.toLowerCase(),
  });

  categoryExist && next(new AppError("category already exist", 400));

  if (!req.file) {
    return next(new AppError("image is required", 404));
  }

  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Ecommerce/categories/${customId}`,
    }
  );
  req.filePath = `Ecommerce/categories/${customId}`;

  // Create a new category
  const newCategory = await categoryModel.create({
    name,
    slug: slugify(name, {
      lower: true,
      replacement: "_",
    }),
    image: { secure_url, public_id },
    customId,
    createdBy: req.user._id,
  });

  req.data = {
    model: categoryModel,
    id: newCategory._id,
  };

  newCategory
    ? res.status(201).json({ msg: "done", category: newCategory })
    : next(new AppError("category not created", 500));
});

// =========================================== updateCategory ===========================================

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  // Check if the category already exists
  const category = await categoryModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });

  if (!category) {
    return next(new AppError("category not exist", 400));
  }

  if (name) {
    if (name.toLowerCase() === category.name) {
      return next(new AppError("name should be different", 400));
    }
    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("name already exist", 409));
    }
    category.name = name.toLowerCase();
    category.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Ecommerce/categories/${category.customId}`,
      }
    );
    category.image = { secure_url, public_id };
  }

  await category.save();
  return res.status(200).json({ msg: "done", category });
});

// =========================================== getCategories ===========================================

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel
    .find({})
    .populate([{ path: "subCategories" }]);

  res.status(201).json({ msg: "done", categories });
});

// =========================================== deleteCategory ===========================================

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
  });

  if (!category) {
    return next(
      new AppError("category not exist or you don't have permission", 401)
    );
  }

  // delete subCategories related with this category
  await subCategoryModel.deleteMany({ category: category._id });

  // delete from cloudinary
  await cloudinary.api.delete_resources_by_prefix(
    `Ecommerce/categories/${category.customId}`
  );
  await cloudinary.api.delete_folder(
    `Ecommerce/categories/${category.customId}`
  );

  res.status(201).json({ msg: "done", category });
});
