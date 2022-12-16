import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  findBreakingChanges,
  GraphQLNonNull,
} from "graphql";
import { booksData, authorsData } from "./data.js";

const app = express();

const autherDataType = new GraphQLObjectType({
  name: "auther",
  description: "Auther data fields",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(bookDataType),
      resolve: (author) => {
        return booksData.filter((book) => book.authorId == author.id);
      },
    },
  }),
});

const bookDataType = new GraphQLObjectType({
  name: "book",
  description: "book data field",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    authorId: { type: GraphQLInt },
    auther: {
      type: autherDataType,
      resolve: (book) => {
        return authorsData.find((author) => author.id == book.authorId);
      },
    },
  }),
});

const mutation = new GraphQLObjectType({
  name: "RootMutation",
  description: "Root mutation to add book and auther",
  fields: () => ({
    addBook: {
      type: bookDataType,
      args: {
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (book, args) => {
        booksData.push({
          id: booksData.length + 1,
          name: args.name,
          authorsId: args.authorId,
        });
      },
    },
  }),
});

const query = new GraphQLObjectType({
  name: "RootQuery",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(bookDataType),
      resolve: () => booksData,
    },
    authors: {
      type: new GraphQLList(autherDataType),
      resolve: () => authorsData,
    },
    book: {
      type: bookDataType,
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
      },
      resolve: (book, args) => {
        return booksData.find((book) => book.id == args.id);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query,
  mutation,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get("/", (req, res) => res.send("Hello world"));

app.listen(8080, () => console.log("Up and running"));
