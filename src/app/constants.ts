export const API_URL = "http://127.0.0.1:8080"

export const LOGIN_REGEX = /^[\w-]{10,}$/
export const PASSWORD_REGEX = /^(?=.*\d)[\w-]{12,}$/


export const LOGIN_PASSWORD_ERROR = "Invalid login or password.";
export const USER_DEACTIVATED_ERROR = "User is deactivated.";
export const USER_CREATE_ERROR = "Cannot create a user with the given data, it might already be used.";
export const UNEXPECTED_ERROR = "Something went wrong. Please contact support.";
