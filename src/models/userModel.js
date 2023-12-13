const bcrypt = require("bcrypt");
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Mobile: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      default: "user",
    },
    Cart: {
      type: Array,
      default: [],
    },
    Address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    WishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    IsBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.Password = await bcrypt.hash(this.Password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

const User = mongoose.model("User", userSchema);
//Export the model
module.exports = User;
