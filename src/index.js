const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/categoryRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const couponRouter = require("./routes/couponRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

// connect database
dbConnect();

// Middlewares
app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/color", colorRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Errors
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
  const dirPath = path.resolve(__dirname, "../../public/images");
  fs.readdir(path.join("public", "images"), function (err, files) {
    if (err) {
      // some sort of error
      console.log(err);
    } else {
      if (files) {
        // directory appears to be empty
        files.forEach((file) => {
          const filePath = path.join("public", "images", file);
          if (!fs.lstatSync(filePath).isDirectory()) fs.unlinkSync(filePath);
        });
      }
    }
  });
});
