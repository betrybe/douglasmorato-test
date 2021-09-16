const UserModel = require('../models/userModel');

class UserService {
  static async insert(data) {
    const user = await UserModel.findByEmail(data.email);
    if (user) {
      return { status: 409, return: { message: 'Email already registered' } };
    }
    const insertdata = data.role ? data : { ...data, role: 'user' };
    const inserted = await UserModel.insert(insertdata);
    return { status: 201, return: inserted };
  }

  static async getAll() {
    return UserModel.findAll();
  }

  static async getById(id) {
    return UserModel.findByEmail(id);
  }

  static async getByLogin(login) {
    return UserModel.findByEmail(login);
  }
}

module.exports = UserService;
