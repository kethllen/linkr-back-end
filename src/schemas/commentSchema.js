import joi from "joi";

const commentSchema = joi.object({
  postId: joi.number().required(),
  comment: joi.string().required(),
});

export default commentSchema;
