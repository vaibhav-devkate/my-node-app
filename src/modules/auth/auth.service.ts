import httpStatus from "http-status";
import { tokenService } from "../token";
import { userService } from "../user";
import { tokenTypes } from "../../config/tokens";
import ApiError from "../../utils/ApiError";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string) => {
  // If we were using DB for tokens, we would remove the token here.
  // const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  // if (!refreshTokenDoc) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  // }
  // await refreshTokenDoc.remove();
  
  // For stateless JWT, we can't really "logout" on server side without a blacklist.
  // We just assume client discards the token.
  // Or we verify it's a valid token.
  await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    if (!refreshTokenDoc.sub) {
      throw new Error();
    }
    const user = await userService.getUserById(refreshTokenDoc.sub);
    if (!user) {
      throw new Error();
    }
    // await refreshTokenDoc.remove(); // If using DB
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};
