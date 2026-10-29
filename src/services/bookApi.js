
export async function searchBooks(query) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`,
  );

  if (!response.ok) {
    throw new Error('Kirjojen hakeminen epäonnistui.');
  }

  const data = await response.json();

  if (!Array.isArray(data.docs)) {
    throw new Error('Hakutulosten lukeminen epäonnistui.');
  }

  return data.docs;
}

export function getBookCoverUrl(book) {
  return book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;
}