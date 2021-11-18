import { Request } from "express";
import { Session, SessionData } from "express-session";

export interface MyContext {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
}
