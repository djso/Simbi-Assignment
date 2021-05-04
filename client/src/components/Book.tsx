import { BOOKS } from "../constants";

import styles from "../css/Book.module.css";

interface IBookProps {
  id: string;
}

const Book = ({ id }: IBookProps) => {
  const selectedBook = BOOKS.find((book) => book.id === id);
  return (
    <>
      <p>{selectedBook?.title}</p>
      <div className={styles.text}>{selectedBook?.text}</div>
      {/* <input type="file" accept="audio/*" capture></input> */}
    </>
  );
};

export default Book;
