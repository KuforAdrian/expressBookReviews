const express = require('express');
let booksreal = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userwithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userwithsamename.length > 0){
        return true;
    } else{
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
      if(!doesExist(username)){
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else{
          return res.status(404).json({message: "User already exists!"});
      }
  } else if(!(username && password)){
          return res.status(404).json({message: "User name and password has not been provided"})
  }

  return res.status(404).json({message: "Unable to register user. "})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let getBookListPromise = new Promise((resolve, reject) => {
    try{
        const formattedBooks = JSON.stringify(booksreal,null,10);
        resolve(formattedBooks);
    } catch(error){
        reject(error);
    }
  });

  getBookListPromise.then((formattedBooks) => {
    res.send(formattedBooks);
  }).catch((error) => {
      res.status(500).json({error: `Internal server Error ${error}`});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn_number = req.params.isbn;
    let getBookDetailsISBNPromise = new Promise((resolve, reject) => {
        try{
           const books = booksreal[isbn_number];
           if(books){
                resolve(books)
           } else{
                reject({error: 'Book not Found.' });
           }
        } catch(error){
                reject(error);
        }
    });

    getBookDetailsISBNPromise.then((books) => {
        res.send(books);
    }).catch((error) => {
        res.status(404).json({error: `Internal server Error ${error}`});
    })
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const arrayBooks = Object.keys(booksreal);
  
    const getBookDetailsAuthorPromise = new Promise((resolve, reject) => {
      let foundBooks = [];
  
      arrayBooks.forEach((key, index) => {
        if (booksreal[key].author === author) {
          foundBooks.push(booksreal[key]);
        }
      });
  
      if (foundBooks.length > 0) {
        resolve(foundBooks);
      } else {
        reject({ message: "Can't find author with such a name" });
      }
    });
  
    getBookDetailsAuthorPromise
      .then((foundBooks) => {
        res.send(...foundBooks, null, 10);
      })
      .catch((error) => {
        res.status(300).json(error);
      });
});
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const arrayBooks = Object.keys(booksreal);
  
    const getBooksByTitlePromise = new Promise((resolve, reject) => {
      let foundBooks = [];
  
      arrayBooks.forEach((key, index) => {
        if (booksreal[key].title === title) {
          foundBooks.push(booksreal[key]);
        }
      });
  
      if (foundBooks.length > 0) {
        resolve(foundBooks);
      } else {
        reject({ message: "Can't find books with such a title" });
      }
    });
  
    getBooksByTitlePromise
      .then((foundBooks) => {
        res.send(foundBooks, null, 10);
      })
      .catch((error) => {
        res.status(300).json(error);
      });
});
  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbnNumber = req.params.isbn;
  
    const getBookReviewsPromise = new Promise((resolve, reject) => {
      if (books[isbnNumber] && books[isbnNumber].reviews) {
        resolve(books[isbnNumber].reviews);
      } else {
        reject({ message: "Reviews not available for the specified ISBN" });
      }
    });
  
    getBookReviewsPromise
      .then((reviews) => {
        res.send(reviews);
      })
      .catch((error) => {
        res.status(300).json(error);
      });
});
  

module.exports.general = public_users;
