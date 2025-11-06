import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW, VIRTUAL } = DataTypes;

export default (sequelize) => {
  const Clinic = sequelize.define(
    "Clinic",
    {
      clinic_id: {
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
      created_at: {
        type: DATE,
        defaultValue: NOW,
      },
    },
    {
      tableName: "Clinic",
      timestamps: false,
    }
  );


  return Clinic;
};
