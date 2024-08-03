import * as routers from "../src/modules/index.routes.js";
import connectionDB from "../db/connectionDB.js";
import { AppError } from "../src/utils/classError.js";
import { globalErrorHandling } from "../src/utils/globalErrorHandling.js";
import { deleteFromDb } from "./utils/deleteFromDb.js";
import { deleteFromCloudinary } from "./utils/deleteFromCloudinary.js";
import cors from "cors";

export const initApp = (app, express) => {
  app.use(cors());

  // connect to db
  connectionDB();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("server is running");
  });

  app.use("/users", routers.userRouter);
  app.use("/categories", routers.categoryRouter);
  app.use("/subCategories", routers.subCategoryRouter);
  app.use("/brands", routers.brandRouter);
  app.use("/products", routers.productRouter);
  app.use("/coupons", routers.couponRouter);
  app.use("/cart", routers.cartRouter);
  app.use("/order", routers.orderRouter);
  app.use("/review", routers.reviewRouter);
  app.use("/wishList", routers.wishListRouter);

  // handle invaild URLs
  app.use("*", (req, res, next) => {
    return next(new AppError(`invalid url ${req.originalUrl}`, 404));
  });

  // global error handler
  app.use(globalErrorHandling, deleteFromCloudinary, deleteFromDb);
};
