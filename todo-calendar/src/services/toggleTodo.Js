export const toggleTodo = (todos, dateString, index, setTodos) => {
  const updatedTodos = todos[dateString].map((todo, i) => {
    if (i === index) {
      return { ...todo, completed: !todo.completed }; // completed 상태를 반전
    }
    return todo;
  });

  setTodos((prevTodos) => ({
    ...prevTodos,
    [dateString]: updatedTodos,
  }));
};