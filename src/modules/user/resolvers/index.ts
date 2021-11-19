import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../entity";
import { RegisterInput } from "../inputs/register_input";
import { MyContext } from "src/types/my_context";

@Resolver(User)
export class UserResolver {
  @Authorized()
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session.userId) {
      return undefined;
    }
    return User.findOne(ctx.req.session.userId);
  }

  @Query(() => User)
  async user(@Arg("id") id: number): Promise<User | undefined> {
    const user = await User.findOneOrFail(id);
    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg("registerInput")
    { email, firstName, lastName, password }: RegisterInput
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
