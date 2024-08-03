import mongoose from "mongoose";

const connectionDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL_ONLINE)
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log("db connected fail", err);
    });
};

export default connectionDB;
