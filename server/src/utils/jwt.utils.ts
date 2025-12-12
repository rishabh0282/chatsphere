import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'change_me';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'change_me_refresh';

export interface TokenPayload {
  userId: string;
}

export const signAccessToken = (payload: TokenPayload, expiresIn: string | number = '15m') =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn } as jwt.SignOptions);

export const signRefreshToken = (payload: TokenPayload, expiresIn: string | number = '7d') =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn } as jwt.SignOptions);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as TokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as TokenPayload;

