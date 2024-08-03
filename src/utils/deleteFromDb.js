export const deleteFromDb = async (req, rees, next) => {
  if (req?.data) {
    const { model, id } = req.data;
    await model.deleteOne({ _id: id });
  }
};
