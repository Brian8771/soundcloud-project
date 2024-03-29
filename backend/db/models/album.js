'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Album.belongsTo(models.User, { foreignKey: 'userId' })
      Album.hasMany(models.Song, { foreignKey: 'albumId' })
    }
  }
  Album.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    previewImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Album',
    defaultScope: {
      attributes: {}
    },
    scopes: {
      albumSong: {
        attributes: {
          exclude: ['userId', 'description', 'createdAt', 'updatedAt']
        }
      }
    }
  });
  return Album;
};
