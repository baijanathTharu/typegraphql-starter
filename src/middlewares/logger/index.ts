import { MyContext } from "types/my_context";
import { MiddlewareFn } from "type-graphql";

export const logger: MiddlewareFn<MyContext> = ({ args }, next) => {
  console.log("Args", args);
  return next();
};
