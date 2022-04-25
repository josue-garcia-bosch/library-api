import * as userService from '../../../domains/user/service/user.service'
import { validationResult } from 'express-validator';


export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newUser = await userService.createUser(req.body)
    if (newUser.statusCode) return res.status(newUser.statusCode).json(newUser.message);

    return res.status(200).json(newUser.user);
};

export const getUsers = async (req, res) => {
    const { limit, order, page, search } = req.query;
    const users = await userService.getUsers(limit, order, page, search);
    return res.status(200).json(users);
};

export const getUser = async (req, res) => {
    const { userId } = req.params;
    const user = await userService.getUser(userId);
    if(!user) return res.status(404);

    return res.status(200).json(user);
};

export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    const user = await userService.deleteUser(userId);

    if(!user) return res.status(404).json();

    return res.status(200).json(user);
};


export const promoteUser = async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { userId } = req.params;
    const { role } = req.body;

    const user = await userService.promoteUser(userId, role);
    if (user.statusCode) return res.status(user.statusCode).json(user.message);

    return res.status(204).json(user);
};