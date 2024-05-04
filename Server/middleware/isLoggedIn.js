/*** Middleware per verificare se l'utente è autenticato o meno quando chiama una route (serve anche a proteggere la route, in quanto se l'utente non è autenticato e prova ad accedere alla route ottiene un errore: status code "401" ed il messaggio error: Utente non autenticato!) ***/
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // controllo se sono autenticato (dopo esser stato deserializzato con passport.deserializeUser), prima di procedere con il codice presente nella route chiamante, altrimenti viene restituito un 401 Unauthorized
    console.log(`L'utente ${req.user.nome} è autenticato!`);
    return next();
  }
  return res.status(401).json({ error: "Utente non autenticato!" });
}

module.exports = isLoggedIn;
