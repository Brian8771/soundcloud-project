'use strict';
const bcrypt = require('bcryptjs')
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    toSafeObject() {
      const { id, firstName, lastName, email, username, previewImage } = this;
      return { id, firstName, lastName, email, username, previewImage };
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    }
    static getCurrentUserById(id) {
      return User.scope('currentUser').findByPk(id)
    }
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id)
      }
    }
    static async signup({ firstName, lastName, email, username, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        hashedPassword
      })
      return await User.scope('currentUser').findByPk(user.id)
    }
    static associate(models) {
      // define association here
      User.hasMany(models.Album, { foreignKey: 'userId' })
      User.hasMany(models.Playlist, { foreignKey: 'userId' })
      User.hasMany(models.Song, { foreignKey: 'userId' })
      User.hasMany(models.Comment, { foreignKey: 'userId' })
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING,

      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,

      validate: {
        len: [3, 256]
      }
    },
    bio: {
      type: DataTypes.STRING
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    previewImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ["hashedPassword", 'createdAt', 'updatedAt'] }
      },
      loginUser: {
        attributes: {}
      },
      Artist: {
        attributes: { exclude: ["hashedPassword", 'createdAt', 'updatedAt', 'firstName', 'lastName', 'email'] }
      },
      User: {
        attributes: {
          exclude: ["hashedPassword", 'createdAt', 'updatedAt', 'firstName', 'lastName', 'email']
        }
      }
    }
  });
  return User;
};
