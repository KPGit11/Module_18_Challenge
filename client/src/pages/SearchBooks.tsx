import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

interface Book {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
}

interface SearchData {
  me: {
    _id: string;
    username: string;
    savedBooks: Book[];
  };
}

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [saveBook] = useMutation(SAVE_BOOK, {
    update(cache, { data: { saveBook } }) {
      const { me } = cache.readQuery<SearchData>({ query: GET_ME }) || { me: null };
      
      if (me) {
        cache.writeQuery({
          query: GET_ME,
          data: { me: { ...me, savedBooks: [...me.savedBooks, saveBook] } },
        });
      }
    }
  });

  // Rest of your component logic here
};

export default SearchBooks;
