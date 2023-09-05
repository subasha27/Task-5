const { Sequelize } = require("sequelize");


const sequelize = new Sequelize(
    'eventcreation',
    'root',
    'rootpass', {
    host: 'localhost',
    dialect: 'mysql'
}
)

sequelize.authenticate().then(() => {
    console.log('connection has been established')
}).catch((error) => {
    console.error('Unable to connect to the database', error)
})

module.exports = sequelize;