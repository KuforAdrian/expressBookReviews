const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
      return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 180 * 5});

        req.session.authorization = {
            accessToken, username
        }

        return res.status(200).send("User successfully logged in");
  } else {
            return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn_number = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;
  
  if (!username) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  if (!isbn_number || !review) {
    return res.status(400).json({ error: 'ISBN and review are required.' });
  }

  // Check if the book exists
  if (!books[isbn_number]) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  if(books[isbn_number].reviews && books[isbn_number].reviews[username]) {
       // Modify existing review
    books[isbn_number].reviews[username] = review;
    res.json({ message: `Review for book with ISBN ${isbn_number} modified successfully.` });
  }else{
    // Add a new review
        if (!books[isbn_number].reviews) {
        books[isbn_number].reviews = {};
        }

        books[isbn_number].reviews[username] = review;
        res.json({ message: `The review for the book with ISBN ${isbn_number} has been added/updated.`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn_number = req.params.isbn;
    const username = req.session.authorization.username;

    if (!username) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    if (!isbn_number) {
        return res.status(400).json({ error: 'ISBN is required.' });
    }

    if (!books[isbn_number]) {
        return res.status(404).json({ error: 'Book not found.' });
    }

    if(books[isbn_number].reviews && books[isbn_number].reviews[username]) {
        delete books[isbn_number].reviews[username];
        res.json({ message: `Review with username ${username} has been deleted successfully.`});
    } else{
        res.status(404).json({ error: 'Review not found.' });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
