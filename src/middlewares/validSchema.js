import joi from 'joi';

export default function validSchema(schema) {
  return function (req, res, next) {
    const validation = schema.validate(req.body);

    if (validation.error) {
      return res.status(422).send(validation.error.details.map(obj => (obj.message)));
    }
    next();
  }
}