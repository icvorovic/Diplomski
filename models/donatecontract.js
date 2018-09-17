/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('donatecontract', {
    IDContract: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'contract',
        key: 'IDContract'
      }
    },
    EstiamatedValue: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    Quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    DeliveryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'donatecontract',
    timestamps: false,
  });
};
