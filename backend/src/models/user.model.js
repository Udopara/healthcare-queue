import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const { STRING, INTEGER, ENUM, DATE, NOW, VIRTUAL } = DataTypes;

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: STRING(100),
        allowNull: false,
      },
      email: {
        type: STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: "Invalid email format" },
        },
      },
      phone_number: {
        type: STRING(30),
        allowNull: true,
      },
      role: {
        type: ENUM("admin", "clinic", "doctor", "patient"),
        allowNull: false,
      },
      password: {
        type: VIRTUAL,
        set(value) {
          this.setDataValue("password", value);
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password_hash", hash);
        },
      },
      password_hash: {
        type: STRING(255),
        allowNull: false,
      },
      linked_entity_id: {
        type: STRING(50),
        allowNull: true,
        comment: "Reference to a role-specific entity",
      },
      created_at: {
        type: DATE,
        defaultValue: NOW,
      },
    },
    {
      tableName: "User",
      timestamps: false,
      hooks: {
        beforeCreate: async (user, options) => {
          const { Clinic, Patient, Doctor } = sequelize.models;
          const clinicContextId = options?.context?.clinicId ?? null;

          switch (user.role) {
            case "clinic": {
              const clinic = await Clinic.create({
                clinic_name: user.name,
                email: user.email,
                phone_number: user.phone_number,
              });
              user.linked_entity_id = clinic.clinic_id;
              break;
            }
            case "patient": {
              const patient = await Patient.create({
                full_name: user.name,
                email: user.email,
                phone_number: user.phone_number,
              });
              user.linked_entity_id = patient.patient_id;
              break;
            }
            case "doctor": {
              if (!clinicContextId) {
                throw new Error("Doctor registration requires a clinic assignment");
              }
              const doctor = await Doctor.create({
                full_name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                clinic_id: clinicContextId,
              });
              user.linked_entity_id = doctor.doctor_id;
              break;
            }
            default:
              user.linked_entity_id = null;
          }
        },
      },
    }
  );

  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
  };

  return User;
};
