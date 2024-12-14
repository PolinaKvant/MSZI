import { UserAttributes } from "@/database/models/UserModel";

export default class UserDto {
  id;
  name;
  email;

  constructor(user: UserAttributes) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }
}
