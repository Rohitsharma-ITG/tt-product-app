//Success messages
export const SuccessMessage = {
  FETCHED: "fetched successfully.",
  LIST_FETCHED: "list fetched successfully.",
  CREATED: "created successfully.",
  UPDATED: "updated successfully.",
  SAVED: "saved successfully.",
  ADDED: "added successfully.",
  DELETED: "deleted successfully.",
  CHANGE: "changed successfully.",
  REMOVE: "removed successfully.",
  OK: 'Ok',
};

//Error messages
export const ErrorMessage = {
  INTERNAL_SERVER_ERROR: "Internal server error.",
  SHOP_UNAVAILABLE: "Shop not found.",
  SHOP_INVALID: "Shop not valid.",
  NOT_FOUND: "Not found.",
  NOT_CREATED: "not created.",
  ALREADY_EXIST: "Already exist.",
  ID_NOT_FOUND: "Id not found",
  INVALID_API_PATH: "Invalid API path",
  FILE_NOT_FOUND: "File not found",
  INVALID_FILE_TYPE: "Invalid file type",
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  INVALID_REQUEST: "Invalid Request",
};

export const statusCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PERMISSION_DENIED: 403,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  INVALID_REQUEST: 403
};
export default { SuccessMessage, ErrorMessage, statusCode };