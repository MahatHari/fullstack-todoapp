const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Todo = sequelize.define(
  "Todo",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title can not be empty",
        },
        len: {
          args: [2, 100],
          msg: "Ttitle must be between 2 and 100 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "in_progress", "completed"]],
          msg: "Invalid status",
        },
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "Invalid Date format",
        },
        isFuture(value) {
          if (value && value < new Date()) {
            throw new Error("Due date cannot be in the past");
          }
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "todos",
    timestamps: true,
  }
);

// Define the relationship with user Model
const User = require("./user");
Todo.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Todo, {
  foreignKey: "userId",
  as: "todos",
  onDelete: "CASCADE",
});
module.exports = Todo;
