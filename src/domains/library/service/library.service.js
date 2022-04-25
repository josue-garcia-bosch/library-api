import Book from '../models/book'
import * as userService from '../../user/service/user.service'
import { Types } from 'mongoose'; 
const ObjectId = Types.ObjectId;


export const createBook = async (book) => {
  try {
    const { imageURL, title, yearOfPublication, author, category } = book;
    const newBook = new Book({
      imageURL,
      title,
      yearOfPublication,
      author,
      category
    });

    const bookSaved = await newBook.save();
    return bookSaved;
  } catch (error) {
    
    if(error.code == 11000){
      throw new Error(`duplicated key please review it: ${error}`)
    }

    throw error;
  }
};

export const getBookById = async (bookId) => {
  const book = await Book.findById(bookId).populate('lent', 'name email');
  return book
};

export const getBooks = async (limit, sort, page, search) => {
  const skip = page * limit;
  if (search)
    return await Book.find({ $text: { $search: `\"${search}\"` } }).populate('lent', 'name email').skip(skip).limit(limit).sort(sort);
  else
    return await Book.find({}).populate('lent', 'name email').skip(skip).limit(limit).sort(`${sort}`);
};

export const patchBookById = async (bookId, book) => {
  try {

    const result = await Book.findByIdAndUpdate(bookId, book).populate('lent', 'name email');

    if (!result) return { statusCode: 404, message: "book not found" };

    return result;
  } catch (ex) {
    console.log(ex);
    return { statusCode: 500, message: "internal server error" };
  }
};

export const deleteBookById = async (bookId) => {
  try{
    const deleted = await Book.findByIdAndDelete(bookId).populate('lent', 'name email');
    if(deleted)
      return deleted;
    else 
      return {statusCode: 404, message: "book not found" }
  }catch(ex){
    console.log(ex);
    return { statusCode: 500, message: "internal server error" };
  }
};

export const assignBooks = async(bookId, assigneeId) =>{
    const assignee = await userService.getUser(assigneeId);
    if(!assignee) return {statusCode: 404, message: "assignee provided does not exist"};


    const bookUpdate = await Book.findByIdAndUpdate(bookId, {lent: assignee._id});
    if (!bookUpdate) return { statusCode: 404, message: "book to assign is not found" };

    return bookUpdate;
};

export const borrowBook = async (bookId, borrowerId) => {
    const bookFound = await Book.findById(bookId);
    if (!bookFound) 
      return { statusCode: 404, message: "book to assign is not found" };

    if(bookFound.lent)
      return {statusCode: 400, message: "books is already assigned"}

    const bookUpdate = await Book.findByIdAndUpdate(bookId, {lent: borrowerId}).populate('lent', 'name email');
    return bookUpdate;

};

export const returnBooks = async (bookId, borrowerId) => {
  const filter = {_id: bookId, "lent": ObjectId(borrowerId) };
  console.log(filter);
  const bookFound = await Book.findOne(filter);
  if (!bookFound) 
    return { statusCode: 400, message: "book to assign is not found or not assigned to you" };


  const bookUpdate = await Book.findByIdAndUpdate(bookId, {lent: null}).populate('lent', 'name email');
  return bookUpdate;
};

