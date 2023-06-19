require("dotenv").config();
const db = require("../db/db");
const express = require("express");
const router = express.Router();
let books = require("../app/data/books");

router.get("/", (req, res) => {
  res.write(`App running on ${process.env.PORT}`);
  res.end();
});

router.get("/books", async (req, res) => {
  res.json({ books: await db.getBooks() });
});

router.get("/book/:isbn", async (req, res) => {
  try {
    const dbRes = await db.getBookByIsbn(req.params.isbn);
    res.status(200).json({ books: dbRes });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/book", async (req, res) => {
  if (req.query.pages) {
    let resp = {};

    try {
      const result = await db.getBooksByPages(req.query.pages);
      resp  = { books: result };
    } catch (error) {
      resp = { error: error.message, code: 500 };
      console.log(resp);
    }

    res.send(resp);
  } else {
    res.redirect("/lib/books");
  }
});

router.post("/book", async (req, res) => {
  try {
    console.log("Request body: " + JSON.stringify(req.body));
    const book = req.body;
    const result = await db.createBook(book);
    if (result === "success") {
      res.status(200).json({
        message: `Book created successfully with ISBN : ${book.isbn}`,
      });
    } else {
      res
        .status(500)
        .json({ message: "Error occured during inserting into DB" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ code: 500, message: "Error during DB insert" });
  }
});

router.put("/book/:isbn", (req, res) => {
  const updBook = req.body;
  /* const updIdx = books.findIndex((obj) => obj.isbn === req.params.isbn);
  if (updIdx === -1) {
    res.status(404).send(`Book with ISBN ${req.params.isbn} not found`);
  } else {
    books[updIdx] = updBook;
    console.log(JSON.stringify(books));
    res.send(`Book details with ISBN ${req.params.isbn} updated successfully`);
  } */
});

module.exports = router;