import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW, VIRTUAL } = DataTypes;

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clinic_name: {
        type: STRING(100),
        allowNull: false,
      },
      email: {
        type: STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      phone_number: {
        type: STRING(50),
      },
      password: {
        type: VIRTUAL,
        set(value) {
          this.setDataValue("password", value);
          this.setDataValue("password_hash", bcrypt.hashSync(value, 10));
        },
        validate: {
          len: {
            args: [8, 255],
            msg: "Password must be between 8 and 255 characters",
          },
        },
      },
      password_hash: {
        type: STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DATE,
        defaultValue: NOW,
      },
    },
    {
      tableName: "User",
      timestamps: false,
    }
  );

  User.prototype.confirmPassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
  };

  return User;
};
