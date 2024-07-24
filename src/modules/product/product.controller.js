import productModel from "../../../db/models/product.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";
import {nanoid} from "nanoid";
import slugify from "slugify";
import cloudinary from "../../service/cloudinary.js";
import categoryModel from "../../../db/models/category.model.js";
import subCategoryModel from "../../../db/models/subCategory.model.js";

// =========================================== addproduct ===========================================

export const addProduct = asyncHandler(async (req, res, next) => {
  const { title, stock, discount, price, brand, subCategory, category, description } = req.body;

  // Check if the category exist
  const categoryExist = await categoryModel.findOne({_id: category});
  if (!categoryExist) {
    return next(new AppError("category not exist", 404));
  }
   
    // Check if the subCategory exist
  const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category});
  if (!subCategoryExist) {
    return next(new AppError("subCategory not exist", 404));
  }

     // Check if the brand exist
     const brandExist = await brandModel.findOne({ _id: brand});
     if (!brandExist) {
       return next(new AppError("brand not exist", 404));
     }

        // Check if the product already exist
  const productExist = await productModel.findOne({ title: title.toLowerCase()});
  if (!productExist) {
    return next(new AppError("product already exist", 400));
  }

  const subPrice = price - (price * (discount || 0) / 100)

  if (!req.file) {
    return next(new AppError("image is required", 404)); 
  }

  const customId = nanoid(5)
  let list = []
for (const file of req.files.coverImages) {
  const {secure_url, public_id} = await cloudinary.uploader.upload(file.path, {
    folder: `Ecommerce/categories/${categoryExist.customId}/subCategory/${subCategoryExist.customId}/products/${customId}`
      })
      list.push({secure_url, public_id})
}

const {secure_url, public_id} = req.files.image[0]


  // Create a new subProduct
  const product = await productModel.create({
    title,
    slug: slugify(title, {
      replacement:"_",
      lower: true
    }),
    description,
    price,
    discount,
    subPrice,
    stock,
    category,
    subCategory,
    brand,
    image:{secure_url, public_id},
    coverImages: list,
    customId,
    createdBy: req.user._id
  });

  res.status(201).json({ msg: "done", product })
}
);
