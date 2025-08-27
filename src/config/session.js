import session from "express-session";
import FileStore from "session-file-store";

const FileStoreSession = FileStore(session);

export const sessionConfig = 
  session({
    store: new FileStoreSession({ path: "./sessions",retries:0}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, //pra esse trem expirar em 1 hora
  })
;