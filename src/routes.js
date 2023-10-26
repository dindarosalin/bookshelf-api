/* eslint-disable linebreak-style */
const {
  addItem, getAllItems, getItemId, updateItem, deleteItem,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addItem,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllItems,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getItemId,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateItem,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteItem,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: () => 'Halaman tidak ditemukan',
  },
];

module.exports = routes;
