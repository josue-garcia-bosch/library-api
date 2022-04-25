import { Router } from 'express'
import { body } from 'express-validator';


const router = Router()

import * as libraryController from "../http/v1/library.controller"
import * as authHandler from '../middlewares/authMiddleware'

router.get('/', [authHandler.authorizedBy], libraryController.getBooks)

router.get("/:bookId", [authHandler.authorizedBy], libraryController.getBookById);

router.post("/",
    [authHandler.authorizedBy,
    authHandler.isAdmin,
    body('title').notEmpty().withMessage('enter a title'),
    body('author').notEmpty().withMessage('enter an author'),
    body('category').notEmpty().withMessage('enter a category')
    ],
    libraryController.createBook);

router.patch("/:bookId", [authHandler.authorizedBy, authHandler.isAdmin], libraryController.patchBookById);
router.patch("/:bookId/assign/:assigneeId", [authHandler.authorizedBy, authHandler.isAdmin], libraryController.assignBook);
router.patch("/:bookId/borrow", [authHandler.authorizedBy], libraryController.borrowBook);
router.patch("/:bookId/return", [authHandler.authorizedBy], libraryController.returnBook);

router.delete("/:bookId", [authHandler.authorizedBy, authHandler.isAdmin], libraryController.deleteBookById);

export default router;