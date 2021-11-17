import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../entity";

@Resolver(User)
export class UserResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Query(() => User)
  async user(@Arg("id") id: number): Promise<User | undefined> {
    const user = await User.findOneOrFail(id);
    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}
