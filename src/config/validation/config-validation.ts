import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
    // DATABASE
    DB_HOST: Joi.string().min(1).required(),
    OPENAI_API_KEY: Joi.string().min(1).required()
});