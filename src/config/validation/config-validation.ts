import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
    // DATABASE
    DB_CONNECTION: Joi.string().min(1).required(),
    DB_HOST: Joi.string().min(1).required(),
    DB_PORT: Joi.string().min(1).required(),
    DB_DATABASE: Joi.string().min(1).required(),
    DB_USERNAME: Joi.string().min(1).required(),
    DB_PASSWORD: Joi.string().optional(),
});