import joi from 'joi';

const postSchema = joi.object(
    {
        url: joi.string().required(),
        text: joi.string()
    }
)

export default postSchema;