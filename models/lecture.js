/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lecture', {
    IDLecture: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      references: {
        model: 'incontact',
        key: 'Username'
      }
    },
    PIB: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'incontact',
        key: 'PIB'
      }
    },
    TitleSerbian: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    TItleEnglish: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DescriptionSerbian: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    DescriptionEnglish: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Hall: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    FirstName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    SecondName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    Biography: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    FilePath: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'lecture',
    timestamps: false,
  });
};
