const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImage = async (filePath, folder) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      filePath,
      {
        folder,
      },
      function (error, result) {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      }
    );
  });
};

const cloudinaryDeleteImage = async (filePath, folder) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.destroy(
      filePath,
      {
        folder,
      },
      function (error, result) {
        resolve(
          {
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          },
          {
            resource_type: "auto",
          }
        );
      }
    );
  });
};

module.exports = { cloudinaryUploadImage, cloudinaryDeleteImage };
