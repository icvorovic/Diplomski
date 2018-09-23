/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('packageitem', {
    IDPackageItem: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Description: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    IDPackage: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'package',
        key: 'IDPackage'
      }
    }
  }, {
    tableName: 'packageitem',
    timestamps: false
  });
};
