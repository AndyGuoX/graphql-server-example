const {ApolloServer, gql} = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

/**
 * generateUUID 生成UUID
 * @returns {string} 返回字符串
 */
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return uuid;
}


const typeDefs = gql`
  type Book {
    id: String
    title: String
    author: String
  }

  type BookRes {
    total: Int
    bookList: [Book]
  }

  type Query {
    books(page: Int, size: Int, title: String, author: String): BookRes
    viewBook(id: String): Book
  }

  input BooksInput {
    title: String!
    author: String!
  }
  
  type MutationRes {
    code: String
    message: String
  }
  
  type Mutation {
  "123123"
    addBook(post: BooksInput): MutationRes!
    delBook(id: String): MutationRes!
    editBook(id: String, title: String, author: String): MutationRes!
  }
`;

const books = [
  {
    id: '1',
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    id: '2',
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
  {
    id: '3',
    title: '百年孤独',
    author: '加夫列尔·加西亚·马尔克斯',
  },
  {
    id: '4',
    title: '根鸟',
    author: '曹文轩',
  },
  {
    id: '5',
    title: '西游记',
    author: '吴承恩',
  },
  {
    id: '6',
    title: '三国演义',
    author: '罗贯中',
  },
  {
    id: '7',
    title: '红楼梦',
    author: '曹雪芹',
  },
  {
    id: '8',
    title: '水浒传',
    author: '施耐庵',
  },
  {
    id: '9',
    title: '荷马史诗',
    author: '荷马',
  },
  {
    id: '10',
    title: '伊索寓言',
    author: '古希腊奴隶',
  },
  {
    id: '11',
    title: '理想国',
    author: '柏拉图',
  },
  {
    id: '12',
    title: '物性论',
    author: '卢克莱修',
  },
  {
    id: '13',
    title: '亚历山大远征记',
    author: '阿里安',
  },
  {
    id: '14',
    title: '马可·波罗游记',
    author: '马可·波罗',
  },
  {
    id: '15',
    title: '坎特伯雷故事集',
    author: '杰弗雷·乔叟',
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: (parents, args) => {
      const {page, size, title, author} = args;
      let resBooks = books.filter(
        (book) =>
          (!title || book.title === title) && (!author || book.author === author)
      );
      let start = (page - 1) * size;
      const res = {
        total: resBooks.length,
        bookList: resBooks.slice(start, start + size),
      };
      return res;
    },
    viewBook: (parents, args) => {
      const {id} = args;
      return books.find(book => book.id === id);
    }
  },
  Mutation: {
    addBook: (parents, args) => {
      const {title, author} = args.post;
      let res = {
        code: '1',
        message: ''
      };
      let isRepet = false;
      for (let i = 0; i < books.length; i++) {
        if (books[i].title === title && books[i].author === author) {
          isRepet = true;
          break;
        }
      }
      if (!isRepet) {
        const id = generateUUID();
        books.unshift({
          id,
          title,
          author
        });
      } else {
        res.code = '-1';
        res.message = '该书信息已存在';
      }
      return res;
    },
    delBook: (parents, args) => {
      const {id} = args;
      for (let i = 0; i < books.length; i++) {
        if (books[i].id === id) {
          books.splice(i, 1);
          break;
        }
      }
      return {
        code: '1',
        message: ''
      };
    },
    editBook: (parents, args) => {
      const {id, title, author} = args;
      let res = {
        code: '1',
        message: ''
      };
      let isRepet = false;
      for (let i = 0; i < books.length; i++) {
        if (books[i].title === title && books[i].author === author && books[i].id !== id) {
          isRepet = true;
          break;
        }
      }
      if (!isRepet) {
        for (let i = 0; i < books.length; i++) {
          if (books[i].id === id) {
            books[i].title = title;
            books[i].author = author;
            break;
          }
        }
      } else {
        res.code = '-1';
        res.message = '该书信息已存在';
      }
      return res;
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({typeDefs, resolvers});

// The `listen` method launches a web server.
server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
