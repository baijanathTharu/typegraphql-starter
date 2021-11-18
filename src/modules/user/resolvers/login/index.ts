import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { LoginInput } from "../../inputs/login_input";
import { User } from "../../entity";
import { MyContext } from "src/types/my_context";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("loginInput")
    { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    /* *** here we can send cookie *** */
    ctx.req.session.userId = user.id;
    /* *** here we can send cookie *** */

    return user;
  }
}
