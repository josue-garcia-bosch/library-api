import User from '../models/user';
import Role from '../models/Role';
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto"
import config from "../../../modules/config";
import { use } from 'express/lib/application';

export const register = async (signUp) => {
  try {
    signUp.role = config.DEFAULT_ROLE;
    const newUser = await createUser(signUp);
   
    if (newUser.statusCode) return { token: null, statusCode: newUser.statusCode, message: newUser.message };

    const jwtToken = jwt.sign({ id: newUser._id, iat: Date.now(), jti: randomUUID() }, config.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    return jwtToken;
  } catch (error) {
    return { token: null, statusCode: 500, message: "unexpected error signUp user" }
  }
};

export const login = async (login) => {
  try {
    const userFound = await User.findOne({ email: login.email }).populate(
      "role"
    );

    if (!userFound) return { token: null, statusCode: 400, message: "review your email for login" };

    const matchPassword = await User.comparePassword(
      login.password,
      userFound.password
    );

    if (!matchPassword) return { token: null, statusCode: 400, message: "Invalid Password" };

    const jwtToken = jwt.sign({ id: userFound._id, iat: Date.now(), jti: randomUUID() }, config.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    return { token: jwtToken };
  } catch (error) {
    console.error(error);
    return { token: null, statusCode: 500, message: "unexpected error login user" }
  }
};

export const createUser = async (newUser) => {
  try {
    const { name, email, password, role } = newUser;

    const userFound = await User.findOne({ email: email });
    if (userFound)
      return { user: null, statusCode: 400, message: "The email already exists" };
      

    const roleFound = await Role.findOne({ name: role });
    if (!roleFound)
      return { user: null, statusCode: 400, message: `the role ${role} does not exist` };

    const user = new User({
      name,
      email,
      password,
      role: roleFound._id,
    });

    user.password = await User.encryptPassword(user.password);
    const savedUser = await user.save();

    return { _id: savedUser._id, name: savedUser.name, email: savedUser.email, roles: savedUser.role };

  } catch (error) {
    console.error(error);
    return { user: null, statusCode: 500, message: "unexpected error creating user" }
  }
};

export const getUsers = async (limit, ordering, page, search) => {
  const skip = page * limit;
  if(search)
    return await User.find({ $text: { $search: `\"${search}\"` } }).populate("role").skip(skip).limit(limit).sort({ name: ordering }).select({password: 0});
  else
    return User.find({}).populate("role").skip(skip).limit(limit).sort({ name: ordering }).select({password: 0});
};

export const getUser = async (userId) => {
  return await User.findById(userId).populate("role").select({password: 0});
};

export const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId).populate("role").select({password: 0});
};


export const promoteUser = async (userId, roleToPromote) => {
  const roleFound = await Role.findOne({ name: roleToPromote });
  
  if (!roleFound) return { user: null, statusCode: 400, message: `the role ${roleToPromote} does not exist` };

  return await User.findByIdAndUpdate(userId, { role: roleFound._id }).select({password: 0});
}

export const patchUserById = async (userId, user) => {
  return await User.findByIdAndUpdate(userId, user).select({password: 0});
};
