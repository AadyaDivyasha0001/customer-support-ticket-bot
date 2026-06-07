const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,
        default: "Admin",
      },
    },
    {
      timestamps: true,
    }
  );

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    userSchema
  );

console.log(
  "USER MODEL CREATED:",
  User
);

module.exports = User;