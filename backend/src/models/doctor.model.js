import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW, VIRTUAL } = DataTypes;

export default (sequelize) => {
  const Doctor = sequelize.define(
    "Doctor",
    {
      doctor_id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clinic_id: {
        type: INTEGER,
        allowNull: false,
      },
      full_name: {
        type: STRING(100),
        allowNull: false,
      },
      phone_number: {
        type: STRING(50),
        unique: true,
      },
      email: {
        type: STRING(100),
        unique: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      created_at: {
        type: DATE,
        defaultValue: NOW,
      },
    },
    {
      tableName: "Doctor",
      timestamps: false,
    }
  );

  return Doctor;
};
