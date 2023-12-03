export const API_URL = "http://localhost:4200/api";

export const LOGIN_REGEX = /^[\w-]{10,255}$/;
export const PASSWORD_REGEX = /^(?=.*\d)[\w-]{12,255}$/;


export const LOGIN_PASSWORD_ERROR = "Invalid login or password.";
export const USER_DEACTIVATED_ERROR = "User is deactivated.";
export const USER_CREATE_ERROR = "Cannot create a user with the given data, it might already be used.";
export const UNEXPECTED_ERROR = "Something went wrong. Please contact support.";
export const BLOCKED_USER_TEXT = "[User is blocked]";
export const IMAGE_MESSAGE_TEXT = "[image]";
