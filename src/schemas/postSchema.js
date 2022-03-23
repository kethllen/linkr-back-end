import joi from 'joi';

const postSchema = joi.object(
    {
        link: joi.string().required(),
        text: joi.string().allow(null, '')
    }
)

export default postSchema;