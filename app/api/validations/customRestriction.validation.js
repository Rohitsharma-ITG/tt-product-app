import { createCustomRestrictionSchema, updateImageSchema } from "./schema/customRestriction.schema";

export const createCustomRestrictionValidation = async (body) => {
    const { error } = createCustomRestrictionSchema.validate(body);
    if (error) {
        return {
            status: false,
            message: error.details[0].message,
        }
    } else {
        return { status: true }
    }
};
export const imageUpdateValidation = async (body) => {
    const { error } = updateImageSchema.validate(body);
    if (error) {
        return {
            status: false,
            message: error.details[0].message,
        }
    } else {
        return { status: true }
    }
};