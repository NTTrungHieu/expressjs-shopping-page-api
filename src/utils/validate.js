const mongoose = require("mongoose");

const validateMongoId = (id) => {
  const isValid = mongoose.isValidObjectId(id);
  if (!isValid) throw new Error(`This ID is not valid or not found`);
  return id;
};

module.exports = { validateMongoId };
