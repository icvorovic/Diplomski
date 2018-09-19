/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('incontact', {
    Username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'Username'
      }
    },
    PIB: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'company',
        key: 'PIB'
      }
    }
  }, {
    tableName: 'incontact',
    timestamps: false
  });
};
