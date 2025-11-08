import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW, BOOLEAN } = DataTypes;

export default (sequelize) => {
  const PasswordResetToken = sequelize.define(
    "PasswordResetToken",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: STRING(100),
        allowNull: false,
      },
      user_role: {
        type: STRING(20),
        allowNull: false,
        validate: {
          isIn: [["admin", "clinic", "doctor", "patient"]],
        },
      },
      token: {
        type: STRING(255),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DATE,
        allowNull: false,
      },
      used: {
        type: BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DATE,
        defaultValue: NOW,
      },
    },
    {
      tableName: "PasswordResetToken",
      timestamps: false,
    }
  );

  return PasswordResetToken;
};


