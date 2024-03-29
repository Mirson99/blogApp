const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 100,
      minLength: 3,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxLength: 100,
      minLength: 3,
      unique: true,
    },
    password: { type: String, required: true, minLength: 8 },
    profilePic: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
