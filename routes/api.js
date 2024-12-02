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
mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true }).then((ans) => {
  console.log("Connected Successful")
})
.catch((err) => {
  console.log("Error in the Connection")
})

const BookSchema = new Schema({
  comments: { type: []},
  title: { required: true, type: String},
  commentcount: { type: Number}
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
      // let listBooks = await Book.find({});
      // let id_list = listBooks.map(e => e._id)
      // try {
      //   id_list.forEach( async e => {
      //     await Book.findByIdAndDelete(e);
      //   }
      // );
      // res.send("complete delete successful");
      // } catch (error) {
      //   res.send("could not delete all items");
      // }
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
      try {
        if(!comment) {
          res.send("missing required field comment");
         }
         const bookFound = await Book.findByIdAndUpdate({_id: bookid});
         const book_comment = bookFound.comments;
         const book_count = bookFound.commentcount;
         const bookUpdated = await Book.findByIdAndUpdate({_id: bookid}, {
          comments: [...book_comment,comment],
          commentcount: book_count + 1
        }, {new: true});
          res.json(bookUpdated);         
      } catch (error) {
        console.log("good error")
        res.send("no book exists")
      }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      try {
        Book.findByIdAndDelete(bookid,
            (err, x) => {
                if (err) console.log(err)
                else {
                  res.send('delete successful');
                }
            })
    } catch (error) {
      res.send(" no book exists");
    }
    });
};
