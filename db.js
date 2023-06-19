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

const getBooks = async function ({ offset = 0, limit = 100 } = {}) {
  let query_books = `select * from ${process.env.PGTABLE} OFFSET ${offset} LIMIT ${limit}`;
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
  // console.log(payload);
  try {
    let insertQuery = `INSERT INTO public.book(
        isbn, author, published_date, pages, publisher, title, genre, price)
        VALUES ('${payload.isbn}', '${payload.author}', '${payload.published_date}', ${payload.pages}, '${payload.publisher}', 
            '${payload.title}', '${payload.genre}', ${payload.price})`;
    // console.log(insertQuery.trim());
    const res = await client.query(insertQuery);
    // console.log("DB insert success: %s", res);
    return "success";
  } catch (err) {
    console.log(err);
    throw excep.errorQuery("Error Insert query");
  }
};

const updateBook = async function (payload, key) {
  try {
    let bookUpdQuery = `UPDATE public.book
	SET author='${payload.author}', published_date='${payload.published_date}', pages=${payload.pages}, 
  publisher='${payload.publisher}', title='${payload.title}', genre='${payload.genre}', price=${payload.price}
	WHERE isbn = '${key}';`;
    const res = await client.query(bookUpdQuery);
    console.log("Update success: \n %s", res);
    return "success";
  } catch (err) {
    console.log(err);
    throw excep.errorQuery(err);
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
  updateBook,
};
