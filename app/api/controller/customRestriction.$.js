import { ErrorMessage, SuccessMessage, statusCode } from "../constant/messages.js";
import { sendResponse } from "../utils/sendResponse.js";
import { authenticateUser } from "../utils/middleware.js"
import * as customRestrictionService from "../services/customRestriction.service.js"
import * as customRestrictionValidation from "../validations/customRestriction.validation.js"

export const loader = async ({ request, params }) => {
    const path = params["*"];

    try {
        return sendResponse(statusCode.OK, true, SuccessMessage.FETCHED, new Date());
    } catch (error) {
        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }

};

export const action = async ({ request, params }) => {
    const method = request.method;
    const path = params["*"];
    // const url = new URL(request.url);
    console.log(`::------------------------ api/custom-restriction/${path} ------------------------::`);
    // Middleware to authenticate user 
    const validUser = await authenticateUser(request);
    // Return if request is not authenticated
    if (!validUser.status) {
        return sendResponse(validUser.httpCode, validUser.status, validUser.message);
    }
    if (method == 'POST') {
        switch (path) {
            case "list":
                {
                    try {
                        const details = await request?.json();
                        const data = await customRestrictionService.getCustomRestrictionList(details)
                        return sendResponse(statusCode.OK, true, SuccessMessage.LIST_FETCHED, data?.result);
                    } catch (error) {
                        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
                    }
                }
            case "create":
                {
                    try {
                        const details = await request?.json();
                        console.log(details)
                        const validationError = await customRestrictionValidation.createCustomRestrictionValidation(details)
                        if (!validationError?.status) {
                            console.log(validationError)
                            return sendResponse(statusCode.BAD_REQUEST, false, validationError.message);
                        }
                        const data = await customRestrictionService.createCustomRestriction(details)
                        return sendResponse(statusCode.OK, true, SuccessMessage.CREATED, data?.result);
                    } catch (error) {
                        console.log("Error In Create customRestriction: ", error)
                        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
                    }
                }
            default:
                return sendResponse(statusCode.NOT_FOUND, false, ErrorMessage.INVALID_API_PATH);
        }
    } else if (method == 'PUT') {
        switch (path) {
            case "update":
                {
                    try {
                        const details = await request?.json();
                        console.log(details)
                        const validationError = await customRestrictionValidation.createCustomRestrictionValidation(details)
                        if (!validationError?.status) {
                            console.log(validationError)
                            return sendResponse(statusCode.BAD_REQUEST, false, validationError.message);
                        }
                        if (!details?.id) {
                            return sendResponse(statusCode.BAD_REQUEST, false, "ID is required");
                        }
                        const data = await customRestrictionService.updateCustomRestriction(details)
                        if (!data?.status) {
                            return sendResponse(data?.statusCode || statusCode.BAD_REQUEST, false, data?.message);
                        }
                        return sendResponse(statusCode.OK, true, SuccessMessage.UPDATED, data?.result);
                    } catch (error) {
                        console.log("Error In Update customRestriction: ", error)
                        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
                    }
                }
            default:
                return sendResponse(statusCode.NOT_FOUND, false, ErrorMessage.INVALID_API_PATH);
        }
    } else if (method == 'DELETE') {
        switch (path) {
            case "delete":
                {
                    try {
                        const details = await request?.json();
                        if (!details?.id || isNaN(details?.id)) {
                            return sendResponse(statusCode.BAD_REQUEST, false, "ID should be a valid number and It is required");
                        }
                        const data = await customRestrictionService.deleteCustomRestriction(details?.id)
                        if (!data?.status) {
                            return sendResponse(data?.statusCode || statusCode.BAD_REQUEST, false, data?.message);
                        }
                        return sendResponse(statusCode.OK, true, SuccessMessage.DELETED, data?.result);
                    } catch (error) {
                        console.log("Error In Delete customRestriction: ", error)
                        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
                    }
                }
            default:
                return sendResponse(statusCode.NOT_FOUND, false, ErrorMessage.INVALID_API_PATH);
        }
    }
    return sendResponse(statusCode.INVALID_REQUEST, false, ErrorMessage.INVALID_REQUEST);
};

