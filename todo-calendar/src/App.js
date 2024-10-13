import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

function App() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [todos, setTodos] = useState({});
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDate, setActiveDate] = useState(null); // 클릭한 날짜 상태 추가

  useEffect(() => {
    const localTime = new Date(); // 시스템의 로컬 시간
    const utcTime = new Date(localTime.getTime() + localTime.getTimezoneOffset() * 60000); // UTC 시간 계산
  
    console.log('Local Time:', localTime);
    console.log('UTC Time:', utcTime);
    const fetchTodos = async () => {
      try {
        const dateString = date.toISOString().split("T")[0];
        const response = await axios.get(`/api/todos/${dateString}`);
        const fetchedTodos = response.data;
        setTodos((prevTodos) => ({ ...prevTodos, [dateString]: fetchedTodos }));
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, [date]);
  

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setActiveDate(newDate.toISOString().split("T")[0]); // 클릭한 날짜 저장
  };

  const addTodo = async () => {
    if (!input) return;
  
    const localTime = new Date(); // 시스템의 로컬 시간
    const utcTime = new Date(localTime.getTime() + localTime.getTimezoneOffset() * 60000); // UTC 시간 계산
  
    console.log('Local Time:', localTime);
    console.log('UTC Time:', utcTime);
  
    // 로컬 날짜를 UTC로 변환하여 YYYY-MM-DD 형식으로 변환
    const dateString = new Date(date).toISOString().split("T")[0];
    const newTodo = { content: input, priority };
  
    try {
      await axios.post(`/api/todos/${dateString}`, newTodo);
      // ...
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleView = () => {
    setView((prevView) => (prevView === "month" ? "year" : "month"));
  };

  const toggleTodo = (dateString, index) => {
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

  const deleteTodo = (dateString, index) => {
    const todo = todos[dateString][index]; // 해당 인덱스의 todo 가져오기
    const todoId = todo.id; // todo의 고유 ID 값
  
    // 서버로 삭제 요청 전송
    axios.delete(`/api/todos/${dateString}/${todoId}`)
      .then(() => {
        const updatedTodos = todos[dateString].filter((_, i) => i !== index); // 해당 인덱스를 제외한 todos 배열 생성
        setTodos((prevTodos) => ({
          ...prevTodos,
          [dateString]: updatedTodos,
        }));
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };
  
  const tileClassName = ({ date }) => {
    const dateString = date.toISOString().split("T")[0];

    if (activeDate === dateString) return "active-date"; // 클릭한 날짜만 클래스 적용
    return null; // 기타 색상 변경 없음
  };

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <div className="container">
        <h1>To-Do List with Calendar</h1>
        <button onClick={toggleDarkMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={toggleView}>
          {view === "month" ? "Year View" : "Month View"}
        </button>
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileClassName={tileClassName}
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
          <button onClick={addTodo}>Add</button>
          <ul>
            {(todos[date.toISOString().split("T")[0]] || []).map(
              (todo, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      toggleTodo(date.toISOString().split("T")[0], index)
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
                      deleteTodo(date.toISOString().split("T")[0], index)
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