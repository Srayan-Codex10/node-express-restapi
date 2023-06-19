require("dotenv").config();
const { Client } = require("pg");
const excep = require("../exception/exceptions");
const creds = {
  user: `${process.env.PGUSER}`,
  host: "localhost",
  database: `${process.env.PGDB}`,
  password: `${process.env.PGPW}`,
  port: 5432,
};
const client = new Client(creds);

async function connect() {
  await client.connect();
}

const getBooksByPages = async function (pageLimit) {
  let dbRes = {};
  try {
    let query_book_by_pages = `select * from ${process.env.PGTABLE} where pages > ${pageLimit}`;
    const res = await client.query(query_book_by_pages);
    dbRes = res.rows;
  } catch (err) {
    console.log(err.stack);
    throw excep.errorQuery("Incorrect SQL query");
  }
  return dbRes;
};

const getBooks = async function () {
  let query_books = `select * from ${process.env.PGTABLE}`;
  const res = await client.query(query_books);
  return res.rows;
};

const getBookByIsbn = async function (isbn) {
  let res = "";
  const table = process.env.PGTABLE;
  try {
    let book_select_query = `select * from ${table} where ${table}.isbn = '${isbn}'`;
    res = (await client.query(book_select_query)).rows;
  } catch (err) {
    console.log(err);
    res = err.message;
  }
  console.log(res);
  return res;
};

const createBook = async function (payload) {
  console.log(payload);
  try {
    let insertQuery = `INSERT INTO public.book(
        isbn, author, published_date, pages, publisher, title, genre, price)
        VALUES ('${payload.isbn}', '${payload.author}', '${payload.published_date}', ${payload.pages}, '${payload.publisher}', 
            '${payload.title}', '${payload.genre}', ${payload.price})`;
    console.log(insertQuery.trim());
    const res = await client.query(insertQuery);
    console.log("DB insert success: %s", res);
    return "success";
  } catch (err) {
    console.log(err);
    throw excep.errorQuery("Error Insert query");
  }
};

async function disconnect() {
  await client.end();
}

module.exports = {
  connect,
  disconnect,
  getBooksByPages,
  getBooks,
  createBook,
  getBookByIsbn,
};
