import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW, ENUM } = DataTypes;

export default (sequelize) => {
  const Queue = sequelize.define(
    "Queue",
    {
      queue_id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      queue_name: {
        type: STRING(100),
        allowNull: false,
      },
      status: {
        type: ENUM("open", "closed", "paused"),
        defaultValue: "open",
      },
      user_id: {
        type: INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DATE,
        defaultValue: NOW,
      },
    },
    {
      tableName: "Queue",
      timestamps: false,
    }
  );

  return Queue;
};
