import { UserPayload } from './user-payload.interface';
import { Request as ExpressRequest } from 'express';

export interface RequestWithUser extends ExpressRequest {
  user: UserPayload;
}
