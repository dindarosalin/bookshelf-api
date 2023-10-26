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
    const respon = i
      .respon({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
    return respon;
  }

  if (readPage > pageCount) {
    const respon = i
      .respon({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return respon;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newItem = {
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
  }; items.push(newItem);

  const success = items.filter((book) => book.id === id).length > 0;

  if (success) {
    const respon = i
      .respon({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return respon;
  }

  const respon = i
    .respon({
      status: 'fail',
      message: 'gagal menambahkan buku',
    })
    .code(500);
  return respon;
};

const getAllItems = (request, i) => {
  const { name, reading, finished } = request.query;// Terdapat query name
  if (name) {
    const filteredBooksName = items.filter((book) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    }); const respon = i
      .respon({
        status: 'success',
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200); return respon;
  }
  if (reading) {
    const filteredBooksReading = items.filter(
      (book) => Number(book.reading) === Number(reading),
    ); const respon = i
      .respon({
        status: 'success',
        data: {
          book: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200); return respon;
  }
  if (finished) {
    const filteredBooksfinished = items.filter(
      (book) => Number(book.finished) === Number(finished),
    ); const respon = i
      .respon({
        status: 'success',
        data: {
          books: filteredBooksfinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200); return respon;
  }
  const respon = i
    .respon({
      status: 'success',
      data: {
        books: items.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200); return respon;
};

const getItemId = (request, i) => {
  const { bookId } = request.params;
  const book = items.filter((note) => note.id === bookId)[0];
  if (book) {
    const respon = i
      .respon({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return respon;
  }
  const respon = i
    .respon({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return respon;
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
    const respon = i
      .respon({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
    return respon;
  }
  if (readPage > pageCount) {
    const respon = i
      .respon({
        status: 'fail',
        message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return respon;
  } const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString(); const index = items.findIndex((book) => book.id === bookId);// Jika book dengan id yang dicari ditemukan
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
      finished,
      updatedAt,
    }; const respon = i
      .respon({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return respon;
  }

  const respon = i
    .respon({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
  return respon;
};

const deleteItem = (request, i) => {
  const { bookId } = request.params; const index = items.findIndex((book) => book.id === bookId);// Jika book dengan id yang dicari ditemukan
  if (index !== -1) {
    items.splice(index, 1); const respon = i
      .respon({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return respon;
  }
  const respon = i
    .respon({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return respon;
};

module.exports = {
  addItem, getAllItems, getItemId, updateItem, deleteItem,
};
