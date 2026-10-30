const STORAGE_KEY = 'lukulista-saved-books';

export function getBookId(book) {
  if (typeof book.key === 'string' && book.key.trim()) {
    return book.key.trim();
  }

  const title = book.title?.trim().toLocaleLowerCase('fi');
  const authors = book.author_name?.join(', ').trim().toLocaleLowerCase('fi') || '';

  if (!title) {
    throw new Error('Kirjaa ei voi tallentaa ilman nimeä.');
  }

  return `${title}|${authors}`;
}

export function getSavedBooks() {
  const savedBooks = window.localStorage.getItem(STORAGE_KEY);

  if (savedBooks === null) {
    return [];
  }

  let books;
  try {
    books = JSON.parse(savedBooks);
  } catch {
    throw new Error('Tallennettuja kirjoja ei voitu lukea.');
  }

  if (
    !Array.isArray(books)
    || books.some((book) => (
      typeof book?.title !== 'string'
      || typeof book?.key !== 'string'
    ))
  ) {
    throw new Error('Tallennettujen kirjojen tiedot ovat virheelliset.');
  }

  return books;
}

export function saveBook(book) {
  const bookId = getBookId(book);
  const savedBooks = getSavedBooks();

  if (savedBooks.some((savedBook) => getBookId(savedBook) === bookId)) {
    return savedBooks;
  }

  const updatedBooks = [{ ...book, key: bookId }, ...savedBooks];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
  return updatedBooks;
}

export function removeSavedBook(book) {
  const bookId = getBookId(book);
  const updatedBooks = getSavedBooks().filter(
    (savedBook) => getBookId(savedBook) !== bookId,
  );
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
  return updatedBooks;
}
