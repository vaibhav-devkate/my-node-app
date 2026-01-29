import jwt from "jsonwebtoken";
import moment from "moment";
import httpStatus from "http-status";
import config from "../../config/config";
import { tokenTypes } from "../../config/tokens";
import * as userService from "../user/user.service";
import ApiError from "../../utils/ApiError";

/**
 * Generate token
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId: string,
  expires: moment.Moment,
  type: string,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (user: any) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, "days");
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

  // If we were saving tokens to DB, we would do it here.
  // await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Verify token and return token doc (or payload if no DB)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload === "string" || payload.type !== type) {
    throw new Error("Token not found");
  }
  // If using DB, verify token exists in DB
  // const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  // if (!tokenDoc) {
  //   throw new Error('Token not found');
  // }
  // return tokenDoc;
  return payload;
};
