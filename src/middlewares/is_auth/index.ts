import { MyContext } from "types/my_context";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  if (!req.session.userId) {
    throw new Error("not authenticated");
  }
  return next();
};
