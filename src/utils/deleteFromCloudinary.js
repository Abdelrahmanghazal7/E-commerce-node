import cloudinary from "../service/cloudinary.js"

export const deleteFromCloudinary = async (req, rees, next) => {
    if (req?.filePath) {
        await cloudinary.api.delete_resources_by_prefix(req.filePath)
        await cloudinary.api.delete_folder(req.filePath)
    }
    next()
}