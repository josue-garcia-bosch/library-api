import * as libraryService from '../../../domains/library/service/library.service'
import { validationResult } from 'express-validator';



export const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const newBook = await libraryService.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await libraryService.getBookById(bookId);
    if (book)
      return res.status(200).json(book);
    else
      return res.status(404).json("not found");

  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
};

export const getBooks = async (req, res) => {
  try {
    const { limit, sort, page, search } = req.query;
    console.log(limit, sort, page, search)
    const books = await libraryService.getBooks(limit, sort, page, search);
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
};

export const patchBookById = async (req, res) => {
  try {
    const updatedBookResults = await libraryService.patchBookById(req.params.bookId, req.body);
    if (updatedBookResults.statusCode)
      return res.status(updatedBookResults.statusCode).json(updatedBookResults.message);
    else
      return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
};

export const deleteBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await libraryService.deleteBookById(bookId);
    if (book.statusCode)
      return res.status(book.statusCode).json(book.message);
    else
      return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json("error");
  }
};



export const assignBook = async (req, res) => {
  try {
    const { bookId, assigneeId } = req.params;
    const book = await libraryService.assignBooks(bookId, assigneeId);
    if (book.statusCode)
      return res.status(book.statusCode).json(book.message);
    else
      return res.status(204).json();

  } catch (ex) {
    console.log(error);
    return res.status(500).json("error");
  }
};

export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const borrowerId = req.userId;
    const book = await libraryService.borrowBook(bookId, borrowerId);
    if (book.statusCode)
      return res.status(book.statusCode).json(book.message);
    else
      return res.status(204).json();

  } catch (ex) {
    console.log(error);
    return res.status(500).json("error");
  }

};

export const returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const borrowerId = req.userId;
    const book = await libraryService.returnBooks(bookId, borrowerId);
    if (book.statusCode)
      return res.status(book.statusCode).json(book.message);
    else
      return res.status(204).json();

  } catch (ex) {
    console.log(error);
    return res.status(500).json("error")  ;
  }
};
