var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken")

class UserController {
    async index(req, res) {
        var users = await User.findAll();
        res.json(users);
    }

    async findUser(req, res) {
        var id= req.params.id;
        var user = await User.findById(id);

        if(user == undefined) {
            res.status(404).json({});
        } else {
            res.json(user);
        }
    }

    async create(req, res) {
        var {email, name, password} = req.body;
        if(email == undefined) { return res.status(400).json({err: "O e-mail é inválido!"})}

        var emailExists = await User.findEmail(email);
        if(emailExists) {
            return res.status(406).json({err: "O e-mail já está cadastrado!"});
        }

        await User.create(email, password, name);
        return res.status(200).send("OK");
    }

    async edit(req, res) {
        var {id, name, role, email} = req.body;
        var result = await User.update(id, email, name, role);

        if(result != undefined) {
            if(result.status){
                return res.status(200).send("OK");
            } else {
                return res.status(406).send(result.err);
            }
        } else {
            return res.status(500).send("Ocorreu um erro no servidor!");
        }
    }

    async remove(req, res) {
        var id = req.params.id;

        var result = await User.delete(id);

        if(result.status){
            res.status(200).send("OK");
        } else {
            res.status(406).send(result.err);
        }
    }

    async recoverPassword(req, res) {
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if(result.status) {
            res.status(200).send("" + result.token);
        } else {
            res.status(406).send(result.err);
        }
    }
}

module.exports = new UserController();