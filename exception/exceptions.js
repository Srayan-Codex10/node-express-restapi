const errorQuery = (msg) => {
    throw new Error(msg || "Query Error");
};

module.exports = {
  errorQuery
}
