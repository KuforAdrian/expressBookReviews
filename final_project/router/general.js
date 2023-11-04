const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
 res.send(JSON.stringify(books,null,10));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn_number = req.params.isbn;
    res.send(books[isbn_number]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const arraybooks = Object.keys(books);
  console.log(arraybooks);

  arraybooks.forEach((key, index)=>{
    //   console.log(key)
      if(books[key].author === author){
          res.send(books[key],null,10);
      }
    //    else{
    //     return res.status(300).json({message: "Can't find author with such a name"});
    //   }
  })


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
 const title = req.params.title;
 const arraybooks = Object.keys(books);
 arraybooks.forEach((key,index)=>{
     if(books[key].title === title)
     res.send(books[key],null,10);
 })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn_number = req.params.isbn;
  res.send(books[isbn_number].reviews);
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
