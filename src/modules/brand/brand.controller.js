import brandModel from "../../../db/models/brand.model.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";
import { AppError } from "../../utils/classError.js";
import cloudinary from "../../service/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";

// =========================================== addBrand ===========================================

export const addBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Check if the brand already exists
  const brandExist = await brandModel.findOne({ name: name.toLowerCase() });
  brandExist && next(new AppError("brand already exist", 400));

  if (!req.file) {
    return next(new AppError("image is required", 404));
  }

  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `EcommerceC42/brands/${customId}`,
    }
  );

  // Create a new brand
  const newbrand = await brandModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { secure_url, public_id },
    customId,
    createdBy: req.user._id,
  });

  newbrand
    ? res.status(201).json({ msg: "done", brand: newbrand })
    : next(new AppError("brand not created", 500));
});

// =========================================== updateBrand ===========================================

export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  // Check if the brand already exists
  const brand = await brandModel.findOne({ _id: id, createdBy: req.user._id });
  brand && next(new AppError("brand already exist", 400));

  if (name) {
    if (name.toLowerCase() === brand.name) {
      return next(new AppError("name should be different", 400));
    }
    if (await brandModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("name already exist", 409));
    }
    brand.name = name.toLowerCase();
    brand.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `EcommerceC42/categories/${brand.customId}`,
      }
    );
    brand.image = { secure_url, public_id };
  }

  await brand.save();
  return res.status(200).json({ msg: "done", brand });
});
