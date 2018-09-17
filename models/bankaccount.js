/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bankaccount', {
    IDBankAccount: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    Currency: {
      type: DataTypes.STRING(10),
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
    tableName: 'bankaccount',
    timestamps: false,
  });
};
