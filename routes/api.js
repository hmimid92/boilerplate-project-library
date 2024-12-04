/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectDB = async () => {
 await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(resu => {
    console.log("successfully connected");
  })
      .catch(function (error) {
          console.log(`Unable to connect to the Mongo db  ${error} `);
      });
    }

connectDB();



const BookSchema = new Schema({
  comments: [String],
  title: { required: true, type: String},
  commentcount: Number
});

const Book = mongoose.model("Book", BookSchema);
 

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let listBooks = await Book.find({});
      res.json(listBooks)
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) {
        res.send("missing required field title");
        return; 
      } else {
        let newBook = new Book({
          comments: [] ,
          title: title,
          commentcount: 0
        });
        await newBook.save();
  
        res.json({
          _id: newBook._id.valueOf(),
          title: title
        });   
      }
    })
    
    .delete(async (req, res) => {
      // if successful response will be 'complete delete successful'
      let listBooks = await Book.find({});
      let id_list = listBooks.map(e => e._id)
      try {
        id_list.forEach( async e => {
          await Book.findByIdAndDelete(e);
        }
      );
      res.send("complete delete successful");
      } catch (error) {
        res.send("could not delete all items");
      }
    });


  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let bookFound = await Book.findById(bookid);
        res.json({
          comments: !bookFound ? [] : bookFound.comments,
          _id: bookid,
          title: bookFound.title,
          commentcount: bookFound.commentcount
        });
      } catch(er) {
        res.send("no book exists");
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment) {
        res.send("missing required field comment");
       }
       
        let bookFound = await Book.findOne({_id: bookid});
        if(!bookFound) {
          res.send("no book exists")
        } else {
          const bookUpdated = await Book.findByIdAndUpdate(bookid, {
            comments: [...bookFound.comments, comment],
            commentcount: bookFound.commentcount + 1
          }, {new: true});
            res.json(bookUpdated);
        }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      try{
        await  Book.findByIdAndDelete({_id: bookid});
        res.send('delete successful');
      } catch(err) {
        res.send('no book exists');
      }
    });
};
