const cloudinary = "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const cloudinaryUploadImage = async (file) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      { public_id: "olympic_flag" },
      function (error, result) {
        resolve(
          {
            url: result.secure_url,
          },
          {
            resource_type: "auto",
          }
        );
      }
    );
  });
};

module.exports = cloudinaryUploadImage;
