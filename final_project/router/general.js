const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (isValid(username)) {
      return res.status(409).json({ message: "Username already exists." });
    }
  
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully!" });
  });
  

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const bookList = await new Promise((resolve, reject) => {
      setTimeout(() => resolve(books), 100);
    });
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
ppublic_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const ISBN = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      setTimeout(() => resolve(books[ISBN]), 100);
    });
    
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => resolve(Object.values(books).filter(book => book.author === author)), 100);
    });
    
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found by this author." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = await new Promise((resolve, reject) => {
      setTimeout(() => resolve(Object.values(books).filter(book => book.title === title)), 100);
    });
    
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;

  if (books[ISBN]) {
    return res.status(200).send(books[ISBN].reviews);
  } else {
    return res.status(404).json({ message: "No review for this book." });
  }
});

module.exports.general = public_users;
