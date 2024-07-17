import * as routers from "../src/modules/index.routes.js";
import connectionDB from "../db/connectionDB.js";
import { AppError } from "../src/utils/classError.js";
import { globalErrorHandling } from "../src/utils/globalErrorHandling.js";
import dotenv from 'dotenv';

export const initApp = (app, express) =>{
    dotenv.config();

    const port = process.env.PORT || 3001;

    // connect to db
    connectionDB();
    
    app.use(express.json());
    
    app.use("/users", routers.userRouter);
    app.use("/categories", routers.categoryRouter);
    app.use("/subcategories", routers.subCategoryRouter);
    app.use("/brands", routers.brandRouter);
    
    // handle invaild URLs
    app.use("*", (req, res, next) => {
      return next(new AppError(`invalid url ${req.originalUrl}`, 404));
    });
    
    // global error handler
    app.use(globalErrorHandling);
    
    app.listen(port, () => console.log(`app running on port ${port}`));
    
}