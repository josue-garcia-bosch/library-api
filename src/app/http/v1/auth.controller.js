import * as userService from '../../../domains/user/service/user.service'
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const registered = await userService.register(req.body);
    console.log(registered)
    if (registered.statusCode)
        return res.status(registered.statusCode).json(registered.message)

    return res.status(200).json({ token: registered });

};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const login = await userService.login(req.body);
    if (!login.token)
        return res.status(login.statusCode).json(login.message)

    return res.status(200).json({ token: login.token });
};