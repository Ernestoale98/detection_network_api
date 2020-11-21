//Mongo User Instance
var User = require('../models/user');
//Node bcrypt
const bcrypt = require('bcrypt');
//Moment Instance
var moment = require('moment');

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

    static async storeRelationOfInteraction(user_id, partner_id, relation_type) {
        return await neoSession
            .run('MATCH (user:Person),(partner:Person) ' +
                'WHERE user.id = $user_id and partner.id = $partner_id ' +
                'CREATE (user)-[:' + relation_type.toUpperCase() + ' {day:"' + moment().format('YYYY-MM-DD').toString() + '"}]->(partner) ' +
                'RETURN partner', {
                user_id: user_id,
                partner_id: partner_id
            })
            .then((result) => {
                return result.records[0].get('partner').properties;
            }).catch((error) => {
                return Promise.reject('Code: ' + error.code + ' Message: ' + error.message + ' Error: ' + error.name);
            });
    }

    static async storeRelation(user_id, partner_id, relation_type) {
        return await neoSession
            .run('MATCH (user:Person),(partner:Person) ' +
                'WHERE user.id = $user_id and partner.id = $partner_id ' +
                'CREATE (user)-[:' + relation_type.toUpperCase() + ']->(partner) ' +
                'RETURN partner', {
                user_id: user_id,
                partner_id: partner_id
            })
            .then((result) => {
                return result.records[0].get('partner').properties;
            }).catch((error) => {
                return Promise.reject('Code: ' + error.code + ' Message: ' + error.message + ' Error: ' + error.name);
            });
    }

}

module.exports = UserService;
