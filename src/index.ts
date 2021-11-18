import "reflect-metadata";

import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core/dist/plugin/landingPage/graphqlPlayground";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import cors from "cors";

import { UserResolver } from "./modules/user/resolvers";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    context: ({ req }: any) => ({ req }),
  });

  await apolloServer.start();

  const app = Express();

  /* *** cors *** */
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );
  /* *** cors *** */

  /* *** session middleware *** */
  const RedisStore = connectRedis(session);
  const redisClient = new Redis();

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      name: "qid",
      secret: "put_in_env",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7years
      },
    })
  );
  /* *** session middleware *** */

  apolloServer.applyMiddleware({ app });

  app.listen(1721, () => {
    console.log("Server listening at http://localhost:1729/graphql");
  });
};

main().catch((e) => {
  console.log("Something went wrong!!: \n", e);
  process.exit(0);
});
