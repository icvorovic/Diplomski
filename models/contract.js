/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contract', {
    IDContract: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    IDPackage: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'package',
        key: 'IDPackage'
      }
    },
    CreationDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    ExpiredDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    AdditionalComment: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    IDContractStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'contractstatus',
        key: 'IDContractStatus'
      }
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
    tableName: 'contract',
    timestamps: false
  });
};
