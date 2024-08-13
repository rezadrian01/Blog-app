const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    // repliesComment: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1 });

module.exports = mongoose.model("Comment", commentSchema);
