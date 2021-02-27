var knex = require("../database/connection");
var bcrypt = require("bcryptjs");
const PasswordToken = require("./PasswordToken");

class User {

    async findAll() {
        try {
            var result = await knex.select(["id","name","email","role",]).table("users");
            return result;
        } catch (error) {
            return console.error(err);
        }
    }

    async findById(id) {
        try {
            var result = await knex.select(["id","name","email","role",]).where({id}).table("users");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (error) {
            console.error(err);
            return undefined;
        }
    }

    async findByEmail(email) {
        try {
            var result = await knex.select(["id","name","email","role",]).where({email}).table("users");
            if(result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }
    async create(email, password, name) {
        try {
            var hash = await bcrypt.hash(password, 10); 
            await knex.insert({email,password: hash,name,role: 0}).table("users");
        } catch(err) {
            console.error(err);
        }
    }

    async findEmail(email) {
        try {
            var result = await knex.select("*").from("users").where({email});
            
            if(result.length > 0) {
                return true;
            }else {
                return false;
            }

        } catch (error) {
            console.error(err);
            return false;
        }
    }

    async update(id, email, name, role) {
        var user = await this.findById(id);

        if(user != undefined) {
            var editUser = {};

            if(email != undefined) {
                if(email != user.email) {
                    var result = await this.findEmail(email);
                    if(!result) {
                        editUser.email = email;
                    } else {
                        return {status: false, err: "O e-mail já está cadastrado!"};
                    }
                }
            }

            if(name != undefined) {
                editUser.name = name;
            }

            if(role != undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({id}).table("users");
                return {status: true}
            } catch (error) {
                return {status:false, err: err}
            }

        } else {
            return {status: false, err: "O usuário não existe!"};
        }
    }

    async delete(id) {
        var user = await this.findById(id);
        if(user != undefined) {
            try {
                await knex.delete().where({id}).table("users");
                return {status:true}
            } catch (err) {
                return {status: false, err: err}
            }
        } else {
            return {status: false, err: "O usuário não existe."}
        }
    }

    async changePassword(newPassword, id, token) {
        var hash = await bcrypt.hash(newPassword, 10); 
        await knex.update({password: hash}).where({id}).table("users");
        await PasswordToken.setUsed(token);
    }
}

module.exports = new User();