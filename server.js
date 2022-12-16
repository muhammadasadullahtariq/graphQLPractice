import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from "graphql";
import { booksData } from "./data.js";

const app = express();

const booksDataFields = new GraphQLObjectType({
  name: "book",
  description: "book object with book id , name and auther id",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    authorId: { type: GraphQLInt },
  }),
});

const query = new GraphQLObjectType({
  name: "RootQuery",
  description: "First main query",
  fields: () => ({
    books: {
      type: new GraphQLList(booksDataFields),
      resolve: () => booksData,
    },
  }),
});

const schema = new GraphQLSchema({
  query,
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
