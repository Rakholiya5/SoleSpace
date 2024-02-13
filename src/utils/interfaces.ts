import { Request } from 'express';
import { IAdmin } from '../db/models/admin';
import { IUsers } from '../db/models/users';

export interface AdminAuthenticatedRequest extends Request {
    admin?: IAdmin;
}

export interface UserAuthenticatedRequest extends Request {
    user?: IUsers;
}
