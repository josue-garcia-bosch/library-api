import { Router } from 'express'

import * as userController from '../http/v1/user.controller';
import * as authHandler from '../middlewares/authMiddleware'
import { body } from 'express-validator';


const router = Router()


router.post("/",
    [   authHandler.authorizedBy, 
        authHandler.isAdmin,
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({min: 5}).withMessage("at least 5 chars"),
        body("role").notEmpty()
    ],
    userController.createUser
    );

router.get("/", [authHandler.authorizedBy, authHandler.isAdmin], userController.getUsers);
router.get("/:userId", [authHandler.authorizedBy, authHandler.isAdmin], userController.getUser);
router.patch("/:userId/promote",[authHandler.authorizedBy, authHandler.isAdmin, body("role").notEmpty().toLowerCase()] ,userController.promoteUser)
router.delete("/:userId", [authHandler.authorizedBy, authHandler.isAdmin], userController.deleteUser);

export default router;