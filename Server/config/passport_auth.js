const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const user_dao = require("../db/user_dao");

/*** Set up Passport ***/
passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log(`*** email: ${username}, password: ${password} ***`);
    user_dao
      .getUserFromDBbyEmail(username, password)
      .then((user) => {
        if (!user) {
          console.log("Email o password errata.");
          return done(null, false, { message: "Email o password errata." });
        } else {
          console.log("Login effettuato con successo.");
          return done(null, user);
        }
      })
      .catch((err) => {
        console.error("Errore catturato: ", err);
        return done(null, false);
      });
  })
);

/*** Serializzo e Deserializzo l'user (user object <-> session) ***/
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  console.log('Utente SERIALIZZATO');
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  console.log(` Utente DESERIALIZZATO. L'id dell'utente in sessione è: ${id}`);
  user_dao
    .getUserFromDBbyID(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(null, err);
    });
});

/*** Abilito sessioni in Express (Opzione usando 'session-file-store') ***/
function configureSession (app) {
  app.use(
    session({
      store: new FileStore(),
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { sameSite: "Lax" },
    })
  );
}

/*** Abilito Passport per usare le sessioni ****/
function initializePassport (app) {
    app.use(passport.initialize());
    app.use(passport.session());
  }

module.exports = { configureSession, initializePassport };
