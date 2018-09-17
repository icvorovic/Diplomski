/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    Username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true
    },
    FirstName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    LastName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Gender: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    BirthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    LinkedIn: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    RegistrationState: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Status: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    tableName: 'user',
    timestamps: false,
  });
};
