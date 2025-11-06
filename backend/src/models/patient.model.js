import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW, VIRTUAL } = DataTypes;

export default (sequelize) => {
  const Patient = sequelize.define(
    "Patient",
    {
      patient_id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      tableName: "Patient",
      timestamps: false,
    }
  );

  return Patient;
};
