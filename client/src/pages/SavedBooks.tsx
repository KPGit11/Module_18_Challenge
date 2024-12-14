import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

interface Book {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
}

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const userData = data?.me || {};

  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
        update: cache => {
          const { me } = cache.readQuery({ query: GET_ME }) || {};
          if (me) {
            cache.writeQuery({
              query: GET_ME,
              data: {
                me: {
                  ...me,
                  savedBooks: me.savedBooks.filter((book: Book) => book.bookId !== bookId)
                }
              }
            });
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Saved Books</h2>
      {userData.savedBooks?.map((book: Book) => (
        <div key={book.bookId}>
          <h3>{book.title}</h3>
          <button onClick={() => handleDeleteBook(book.bookId)}>
            Remove Book
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedBooks;
