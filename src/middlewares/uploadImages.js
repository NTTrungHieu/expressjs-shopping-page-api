const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs")

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: `Unsupported file format` }, false);
  }
};

const TWO_MB = 2 * 1000000;

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: TWO_MB },
});

const resizeProductImage = async (req, res, next) => {
  if (!req?.files) return next();
  const productPath = `public/images/products/`;
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(productPath + file.filename);
    fs.unlinkSync(productPath + file.filename);
    })
  );
  return next();
};

const resizeBlogImage = async (req, res, next) => {
  if (!req?.files) return next();
  const blogPath = `public/images/blogs/`;
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(blogPath + file.filename);
    fs.unlinkSync(blogPath + file.filename);
    })
  );
  return next();
};

module.exports = { uploadPhoto, resizeBlogImage, resizeProductImage };
