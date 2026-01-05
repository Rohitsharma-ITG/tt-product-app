import Joi from "joi";


export const createCustomRestrictionSchema = Joi.object({
    id: Joi.number().integer().optional(),
    country: Joi.string().trim().required(),
    tax: Joi.number().required(),
    tax_name: Joi.string().trim().required(),
    customs_limit: Joi.number().required(),
    currency: Joi.string().trim().length(3).uppercase().required(),
    is_eu: Joi.boolean().default(false),
    active: Joi.boolean().default(true),
    created_at: Joi.date().optional(),
    updated_at: Joi.date().optional(),
}).required();

export const updateImageSchema = Joi.object({
    id: Joi.number().integer().required(),
    image_name: Joi.string().trim().min(1).max(255).required(),
    color_name: Joi.string().trim().min(1).max(255).required(),
    category: Joi.string().trim().min(1).max(255).required(),
    subcategory: Joi.string().allow(null, "").optional(),
    imageUploadType: Joi.string().optional(),
    fileBase64: Joi.string().required(),
});
