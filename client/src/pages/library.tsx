import { useHistory } from "react-router";
import { BOOKS } from "../constants";
import { TBook } from "../types";

const Library = () => {
  const history = useHistory();
  const books: TBook = BOOKS;
  return (
    <>
      {books.map((book) => (
        <button
          key={book.id}
          onClick={() => {
            history.push(`/read/${book.id}`);
          }}
        >
          {book.title}
        </button>
      ))}
    </>
  );
};

export default Library;
