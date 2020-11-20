//Mongo User Instance
var User = require('../models/user');
//Node bcrypt
const bcrypt = require('bcrypt');
//Neo4j Connection
var neo4j = require('neo4j-driver');
var driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('root', 'root')
)
//Instance new neo4j session
var neoSession = driver.session({
    database: 'network',
    defaultAccessMode: neo4j.session.WRITE
})

class UserService {

    static async signup(phone, password) {
        const user = await User.create({
            phone: phone,
            password: bcrypt.hashSync(password, 10)
        });
        await neoSession
            .run('CREATE (p:Person {id:$id,phone:$phone,status:"stable"}) RETURN p.id as id', {
                id: user.id,
                phone: user.phone
            })
            .then(() => {
                console.log('Neo user was created');
            })
            .catch(error => {
                console.log(error)
            });
        return user;
    }

    static async findById(id) {
        return await User.findById(id);
    }

}

module.exports = UserService;
