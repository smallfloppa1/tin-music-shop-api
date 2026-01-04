import { User } from '../entity/user.entity';

export class UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;

  static fromEntity(entity: User): UserDto {
    const dto = new UserDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.role = entity.role;
    return dto;
  }
}
