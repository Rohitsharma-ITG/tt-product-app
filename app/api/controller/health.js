
import { ErrorMessage, statusCode, SuccessMessage } from "../constant/messages.js";
import { sendResponse } from "../utils/sendResponse.js";


export const loader = async ({ request }) => {
    try {
        return sendResponse(statusCode.OK, true, SuccessMessage.FETCHED, new Date());
    } catch (error) {
        return sendResponse(statusCode.INTERNAL_SERVER_ERROR, false, ErrorMessage.INTERNAL_SERVER_ERROR);
    }

};

