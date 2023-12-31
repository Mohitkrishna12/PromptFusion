import {model, Schema, models} from "mongoose";

const PostSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: { type: String, required: true },
  photo: { type: String, required: true },
});

const Post = models.Post || model("Post", PostSchema);

export default Post;