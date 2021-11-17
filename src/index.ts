import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core/dist/plugin/landingPage/graphqlPlayground";
import { createConnection } from "typeorm";
import { UserResolver } from "./modules/user/resolvers";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });

  await apolloServer.start();

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(1721, () => {
    console.log("Server listening at http://localhost:1729/graphql");
  });
};

main().catch((e) => {
  console.log("Something went wrong!!: \n", e);
  process.exit(0);
});
