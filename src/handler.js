const { nanoid } = require("nanoid");
const books = require("./books");

//menambahkan catatan
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ? true : false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } else {
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
  }
};

//menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let allBook;
  if (name) {
    allBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map(({ id, name, publisher }) => ({ id, name, publisher }));
  } else if (reading) {
    allBook = books.filter((book) => Number(book.reading) === Number(reading)).map(({ id, name, publisher }) => ({ id, name, publisher }));
  } else if (finished) {
    allBook = books.filter((book) => Number(book.finished) === Number(finished)).map(({ id, name, publisher }) => ({ id, name, publisher }));
  } else {
    allBook = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
  }

  return {
    status: "success",
    data: {
      books: allBook,
    },
  };
};

//menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  books.splice(index, 1);
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};

// const filteredGetBook = (books,name,reading,finished) => {
//   return books.map((book) => {
//     if(book.name === name || !!book.reading === reading || !!book.finished === finished){
//       return book;
//     }
//   }).map(({id,name,publisher}) => ({id,name,publisher}));
// }

const getBooks = (books) => {
  books.map(({ id, name, publisher }) => ({ id, name, publisher }));
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
