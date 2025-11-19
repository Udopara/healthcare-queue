import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW } = DataTypes;

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
        allowNull: true,
      },
      full_name: {
        type: STRING(100),
        allowNull: false,
      },
      department: {
        type: STRING(50),
        allowNull: false,
      },
      availability: {
        type: STRING(20),
        allowNull: false,
        defaultValue: "Available", // Available or Busy or Offline
      },
      img_src: {
        type: STRING(500),
        allowNull: true,
      },
      phone_number: {
        type: STRING(50),
        unique: true,
        allowNull: true,
      },
      email: {
        type: STRING(100),
        unique: true,
        allowNull: true,
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
      updated_at: {
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
