var jwt = require("jsonwebtoken");
var secret = "hfaouefnuonfwioafhçawlfnçlkj";

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization']

    if(authToken != undefined) {
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try {
            var decoded = jwt.verify(token, secret);

            if(decoded.role == 1) {
                next();
            } else {
                return res.status(403).send("Você não tem permissão para isso");
            }
        } catch (err) {
            return res.status(403).send("Voce não está autenticado!");
        }

    } else {
        return res.status(403).send("Você não está autenticado");
    }
}