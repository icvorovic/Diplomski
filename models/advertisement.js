/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('advertisement', {
    Username: {
      type: DataTypes.STRING(50),
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
    IDAdvertisement: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Title: {
      type: DataTypes.STRING(70),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(250),
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
    Type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    FilePath: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    tableName: 'advertisement',
    timestamps: false
  });
};
