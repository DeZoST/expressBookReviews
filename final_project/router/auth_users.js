const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find(user => user.username === username);
    const passwordCheck = users.find(user => user.password === password);
    if (user) {
        return passwordCheck;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "access", { expiresIn: '1h' });

        req.session.token = token;

        return res.status(200).json({ message: "Login successful", token: token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.body.review;
    username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review is required." });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!book.reviews) {
        book.reviews = {};
    }
    book.reviews[username] = review;

    return res.status(200).json({ message: "Review added successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (typeof book.reviews === 'object' && book.reviews.hasOwnProperty(username)) {
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully." });
    } else {
        return res.status(404).json({ message: "Review not found or you do not have permission to delete this review." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;