/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('email', {
    IDEmail: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Email: {
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
    tableName: 'email',
    timestamps: false
  });
};
