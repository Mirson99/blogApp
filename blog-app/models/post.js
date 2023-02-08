const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    author: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

PostSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/post/${this._id}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
