import { getBookCoverUrl } from '../services/bookApi';

function BookCard({ book }) {
  const coverUrl = getBookCoverUrl(book);
  const authors = book.author_name?.join(', ') || 'Tekijää ei ilmoitettu';

  return (
    <article className="card h-100">
      {coverUrl && (
        <img
          className="card-img-top"
          src={coverUrl}
          alt={`Kirjan ${book.title} kansi`}
          loading="lazy"
        />
      )}
      <div className="card-body">
        <h2 className="card-title">{book.title}</h2>
        <p className="card-text">{authors}</p>
        {book.first_publish_year && (
          <p className="card-text">
            <small className="text-body-secondary">
              Julkaisuvuosi: {book.first_publish_year}
            </small>
          </p>
        )}
      </div>
    </article>
  );
}

export default BookCard;