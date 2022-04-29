import { Router } from 'express'
import * as authController from '../http/v1/auth.controller'
import { body } from 'express-validator';
import * as authHandler from '../middlewares/authMiddleware'

const router = Router()

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, Content-Type, Accept"
    );
    next();
});

router.post("/register",
    [
        body('email').isEmail().normalizeEmail(),
        body('name').notEmpty(),
        body('password').isLength({ min: 5 }),
    ], authController.register);

router.post("/login",
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 5 }),
    ],
    authController.login);

router.get("/me",
    [authHandler.authorizedBy],
    authController.me);

export default router;

