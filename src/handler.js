/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
const items = require('./items');
const { nanoid } = require('./items');

const addItem = (request, i) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = i
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = i
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const id = nanoid(16);
  const finish = pageCount === readPage;
  const insertAt = new Date().toISOString();
  const updateAt = insertAt;

  const newItem = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finish,
    reading,
    insertAt,
    updateAt,
  }; items.push(newItem);

  const success = items.filter((book) => book.id === id).length > 0;

  if (success) {
    const response = i
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  const response = i
    .response({
      status: 'fail',
      message: 'gagal menambahkan buku',
    })
    .code(500);
  return response;
};

const getAllItems = (request, i) => {
  const { name, reading, finish } = request.query;// Terdapat query name
  if (name) {
    const filteredBooksName = items.filter((book) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    }); const response = i
      .response({
        status: 'success',
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200); return response;
  }
  if (reading) {
    const filteredBooksReading = items.filter(
      (book) => Number(book.reading) === Number(reading),
    ); const response = i
      .response({
        status: 'success',
        data: {
          book: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200); return response;
  }
  if (finish) {
    const filteredBooksfinish = items.filter(
      (book) => Number(book.finish) === Number(finish),
    ); const response = i
      .response({
        status: 'success',
        data: {
          books: filteredBooksfinish.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200); return response;
  }
  const response = i
    .response({
      status: 'success',
      data: {
        books: items.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200); return response;
};

const getItemId = (request, i) => {
  const { bookId } = request.params;
  const book = items.filter((note) => note.id === bookId)[0];
  if (book) {
    const response = i
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }
  const response = i
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;
};

const updateItem = (request, i) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (!name) {
    const response = i
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = i
      .response({
        status: 'fail',
        message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  } const finish = pageCount === readPage;
  const updateAt = new Date().toISOString(); const index = items.findIndex((book) => book.id === bookId);// Jika book dengan id yang dicari ditemukan
  if (index !== -1) {
    items[index] = {
      ...items[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finish,
      updateAt,
    }; const response = i
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return response;
  }

  const response = i
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

const deleteItem = (request, i) => {
  const { bookId } = request.params; const index = items.findIndex((book) => book.id === bookId);// Jika book dengan id yang dicari ditemukan
  if (index !== -1) {
    items.splice(index, 1); const response = i
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return response;
  }
  const response = i
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

module.exports = {
  addItem, getAllItems, getItemId, updateItem, deleteItem,
};
