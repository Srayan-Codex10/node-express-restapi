require("dotenv").config();
const db = require("../db/db");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.write(`App running on ${process.env.PORT}`);
  res.end();
});

router.get("/books", async (req, res) => {
  const rows = await db.getBooks({
    offset: req.query.offset,
    limit: req.query.limit,
  });
  res.json({
    books: rows,
    metadata: {
      count: rows.length,
      lastId: rows[rows.length - 1].isbn,
    },
  });
});

router.get("/book/:isbn", async (req, res) => {
  try {
    const dbRes = await db.getBookByIsbn(req.params.isbn);
    // console.log(res);
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
      resp = { books: result };
    } catch (error) {
      resp = { code: 500, error: error.message };
      console.log(resp);
    }

    res.send(resp);
  } else {
    res.redirect("/lib/books");
  }
});

router.post("/book", async (req, res) => {
  try {
    // console.log("Request body: " + JSON.stringify(req.body));
    const book = req.body;
    const result = await db.createBook(book);
    if (result === "success") {
      res.status(200).json({
        code: 200,
        message: `Book created successfully with ISBN : ${book.isbn}`,
      });
    } else {
      res
        .status(500)
        .json({ code: 500, message: "Error occured during inserting into DB" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ code: 500, message: "Error during DB insert" });
  }
});

router.put("/book/:isbn", async (req, res) => {
  const updBook = {
    ...req.body,
  };
  try {
    const result = await db.updateBook(updBook, updBook.isbn);
    if (result === "success") {
      res.status(200).json({
        code: 200,
        message: `Book ISBN ${updBook.isbn} updated successfully`,
      });
    } else {
      res.status(500).json({
        message: result,
      });
    }
  } catch (err) {
    res.status(500).json({ code: 500, message: err });
  }
});

module.exports = router;