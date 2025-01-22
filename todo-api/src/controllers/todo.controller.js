const { get } = require("../app");
const Todo = require("../models/todo");

// create a new todo

const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const todo = await Todo.create({
      title,
      description,
      dueDate,
      status,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    console.error("Error creating todo", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all todos
const getAllTodos = async (req, res) => {
  console.log("GetALL Route");
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = {
      where: {
        userId: req.user.id,
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    };

    if (status) {
      query.where.status = status;
    }
    const todos = await Todo.findAndCountAll(query);

    res.status(200).json({
      todos: todos.rows,
      total: todos.count,
      currentPage: page,
      totalPages: Math.ceil(todos.count / limit),
    });
  } catch (error) {
    console.error("Error fetching todos", error);
    res.status(500).json({ error: error.message });
  }
};

//Get Todo By Id
const getTodoById = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    console.log(`Todos id ${id} and userId ${userId}`);

    const todo = await Todo.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found!" });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error("Error fetching todos", error);
    res.status(500).json({ error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    // Create updateData object first
    const updateData = {};
    const { title, description, dueDate, status } = req.body;

    // Find the todo
    const todo = await Todo.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Only include fields that were provided in the request
    if (title !== undefined) {
      updateData.title = title.trim();
    }
    if (description !== undefined) {
      updateData.description = description.trim();
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate;
    }

    // Perform the update with the collected data
    await todo.update(updateData);

    // Fetch updated todo and send response
    res.status(200).json({
      message: "Todo updated successfully",
      todo: todo.toJSON(),
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: error.errors[0].message,
      });
    }

    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Error updating todo" });
  }
};

// Delete todo
const deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const todoToDelete = await Todo.findOne({
      where: {
        id,
        userId,
      },
    });
    if (!todo) {
      return res.status(400).json({ error: "Todo not found" });
    }
    await todo.destroy();

    res.json({
      message: "Todo deleteate successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get todos by status
const getTodosByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const todos = await Todo.findAll({
      where: {
        userId: req.user.id,
        status,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos by status:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  getTodosByStatus,
};
