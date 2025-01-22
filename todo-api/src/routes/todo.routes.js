const express = require("express");

const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  getTodosByStatus,
} = require("../controllers/todo.controller");

// Protecting all routes with auth middleware

router.use(auth);

// todo crud routes
router.post("/", createTodo);
router.get("/:id", getTodoById);
router.get("/", getAllTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

// additional route
router.get("/status/:status", getTodosByStatus);

module.exports = router;
