/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('company', {
    PIB: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Address: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    City: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PostCode: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Country: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Logo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Website: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'company',
    timestamps: false,
  });
};
