import axios from "axios";

export const deleteTodo = async (dateString, index, todos, setTodos) => {
  const todo = todos[dateString][index];
  const todoId = todo.id;

  try {
    await axios.delete(`/api/todos/${dateString}/${todoId}`);
    const updatedTodos = todos[dateString].filter((_, i) => i !== index);
    setTodos((prevTodos) => ({
      ...prevTodos,
      [dateString]: updatedTodos,
    }));
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};