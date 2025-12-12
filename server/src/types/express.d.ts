import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      file?: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
      };
    }
  }
}

