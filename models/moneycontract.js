/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('moneycontract', {
    IDContract: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'contract',
        key: 'IDContract'
      }
    },
    Value: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    IsPaymentFinished: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    IsInvoiceSent: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    PaymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'moneycontract',
    timestamps: false,
  });
};
