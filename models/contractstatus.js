/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contractstatus', {
    IDContractStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'contractstatus',
    timestamps: false
  });
};
