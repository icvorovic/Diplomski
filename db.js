var config  = require('./config').values;
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  config.db.name, 
  config.db.username, 
  config.db.password, 
  {
    host: config.db.host,
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

// Connect all the models/tables in the database to a db object, 
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//Models/tables
db.advertisementModel = require('./models/advertisement')(sequelize, Sequelize);  
db.bankAccountModel = require('./models/bankaccount')(sequelize, Sequelize);  
db.companyModel = require('./models/company')(sequelize, Sequelize);  
db.contactModel = require('./models/contact')(sequelize, Sequelize);  
db.contractModel = require('./models/contract')(sequelize, Sequelize);  
db.contractStatusModel = require('./models/contractstatus')(sequelize, Sequelize);  
db.donateContractModel = require('./models/donatecontract')(sequelize, Sequelize);  
db.emailModel = require('./models/email')(sequelize, Sequelize);  
db.inContactModel = require('./models/incontact')(sequelize, Sequelize);  
db.lectureModel = require('./models/lecture')(sequelize, Sequelize);  
db.moneyContractModel = require('./models/moneycontract')(sequelize, Sequelize);  
db.packageModel = require('./models/package')(sequelize, Sequelize);  
db.packageItemModel = require('./models/packageitem')(sequelize, Sequelize);  
db.userModel = require('./models/user')(sequelize, Sequelize);  

//Relations
db.packageModel.hasMany(db.contractModel, {
  foreignKey: 'IDPackage',
  targetKey: 'IDPackage'
});
db.companyModel.hasMany(db.contractModel, {
    foreignKey: 'PIB',
    targetKey: 'PIB'
});
db.companyModel.hasMany(db.bankAccountModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.companyModel.hasMany(db.contactModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.companyModel.hasMany(db.inContactModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.userModel.hasMany(db.inContactModel, {
  foreignKey: 'Username',
  targetKey: 'Username'
});
db.companyModel.hasMany(db.emailModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.packageModel.hasMany(db.packageItemModel, {
  foreignKey: 'IDPackage',
  targetKey: 'IDPackage'
});
db.contractModel.belongsTo(db.companyModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.contractModel.belongsTo(db.companyModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.contractModel.belongsTo(db.packageModel, {
  foreignKey: 'IDPackage',
  targetKey: 'IDPackage'
});
db.bankAccountModel.belongsTo(db.companyModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.emailModel.belongsTo(db.companyModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.contactModel.belongsTo(db.companyModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.inContactModel.belongsTo(db.companyModel, {
  foreignKey: 'PIB',
  targetKey: 'PIB'
});
db.inContactModel.belongsTo(db.userModel, {
  foreignKey: 'Username',
  targetKey: 'Username'
});
db.packageItemModel.belongsTo(db.packageModel, {
  foreignKey: 'IDPackage',
  targetKey: 'IDPackage'
});

module.exports = db;  