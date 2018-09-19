/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contact', {
    IDContact: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Telephone: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    FirstName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    LastName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    PIB: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'company',
        key: 'PIB'
      }
    }
  }, {
    tableName: 'contact',
    timestamps: false
  });
};
