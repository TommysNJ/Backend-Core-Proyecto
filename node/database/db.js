import { Sequelize } from "sequelize";

/*const db = new Sequelize('core_proyecto', 'root', 'Bt0mmyDS', {
    host:'localhost',
    dialect:'mysql'
})*/

const db = new Sequelize('core_proyecto', 'root', 'vXmpGvzzCDSVqguBAjEtlizEshnwrOxB', {
    host: 'autorack.proxy.rlwy.net',
    dialect: 'mysql',
    port: 49014 
});

export default db