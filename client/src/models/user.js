export default class User {
  constructor(username, fullname, email, phonenumber, password, type) {
    this.username = username;
    this.full_name = fullname;
    this.email = email;
    this.phone_number = phonenumber;
    this.password = password;
    this.type = type;
  }
}
