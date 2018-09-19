/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('package', {
    IDPackage: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Status: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Price: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    Duration: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    MaxCompanyNumbe: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'package',
    timestamps: false
  });
};
