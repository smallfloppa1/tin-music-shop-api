import { Role } from './role.enum';
import { Order } from '../../order/entity/order.entity';
export declare class User {
    id: number;
    email: string;
    password_hash: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
    orders: Order[];
}
