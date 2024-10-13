import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { tileClassName } from "./utils/tileClassName";
import { toggleDarkMode } from "./utils/toggleDarkMode";
import { addTodo } from "./services/addTodo";
import { toggleTodo } from "./services/toggleTodo";
import { deleteTodo } from "./services/deleteTodo";
import { toggleView } from "./utils/toggleView";

function App() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [todos, setTodos] = useState({});
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDate, setActiveDate] = useState(null);

  const fetchTodos = useCallback(async () => {
    try {
      const dateString = date.toISOString().split("T")[0];
      const response = await axios.get(`/api/todos/${dateString}`);
      const fetchedTodos = response.data;
      setTodos((prevTodos) => ({ ...prevTodos, [dateString]: fetchedTodos }));
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }, [date]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setActiveDate(newDate.toISOString().split("T")[0]);
  };

  const handleAddTodo = async () => {
    await addTodo(input, date, priority);
    fetchTodos();
    setInput("");
  };

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <div className="container">
        <h1>To-Do List with Calendar</h1>
        <button onClick={() => toggleDarkMode(setIsDarkMode)}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={() => toggleView(view, setView)}> 
          {view === "month" ? "Year View" : "Month View"}
        </button>
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileClassName={tileClassName(activeDate)}
          view={view}
          onViewChange={({ activeStartDate }) => setDate(activeStartDate)}
        />
        <div className="todo-list">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a To-Do"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
          >
            <option value={1}>High Priority</option>
            <option value={2}>Medium Priority</option>
            <option value={3}>Low Priority</option>
          </select>
          <button onClick={handleAddTodo}>Add</button>
          <ul>
            {(todos[date.toISOString().split("T")[0]] || []).map(
              (todo, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={
                      () =>
                        toggleTodo(
                          todos,
                          date.toISOString().split("T")[0],
                          index,
                          setTodos
                        ) // 모듈화된 함수 호출
                    }
                  />
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.content} (Priority: {todo.priority})
                  </span>
                  <button
                    onClick={() =>
                        deleteTodo(date.toISOString().split("T")[0], index, todos, setTodos)
                    }
                  >
                    Delete
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
