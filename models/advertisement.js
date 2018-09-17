/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('advertisement', {
    IDAdvertisement: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      references: {
        model: 'incontact',
        key: 'Username'
      }
    },
    PIB: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'incontact',
        key: 'PIB'
      }
    },
    Type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Title: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    CreationTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ExpireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    FilePath: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'advertisement',
    timestamps: false,
  });
};
