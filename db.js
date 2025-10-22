import { Sequelize, DataTypes} from 'sequelize';

const sequelize = new Sequelize('produto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3309,
    logging: false
});

export {sequelize, DataTypes };