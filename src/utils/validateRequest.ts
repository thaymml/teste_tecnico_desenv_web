import Joi from 'joi';

export const validateUploadRequest = (data: any) => {
    const schema = Joi.object({
        image: Joi.string().base64().required(),
        customer_code: Joi.string().required(),
        measure_datetime: Joi.date().required(),
        measure_type: Joi.string().valid('WATER', 'GAS').required()
    });

    return schema.validate(data, { abortEarly: false });
};

export const validateConfirmRequest = (data: any) => {
    const schema = Joi.object({
        measure_uuid: Joi.string().required(),
        confirmed_value: Joi.number().integer().required()
    });

    return schema.validate(data, { abortEarly: false });
};