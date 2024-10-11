import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
    const [date, setDate] = useState(new Date());
    const [todos, setTodos] = useState({});
    const [input, setInput] = useState('');
    const [priority, setPriority] = useState(1); // 기본 우선순위 설정
    const [isDarkMode, setIsDarkMode] = useState(false); // 다크 모드 상태

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const addTodo = () => {
        if (!input) return;
        const dateString = date.toISOString().split('T')[0];
        setTodos((prevTodos) => ({
            ...prevTodos,
            [dateString]: [
                ...(prevTodos[dateString] || []),
                { text: input, completed: false, priority },
            ],
        }));
        setInput('');
        setPriority(1); // 입력 후 우선순위 초기화
    };

    const toggleTodo = (dateString, index) => {
        setTodos((prevTodos) => {
            const newTodos = [...(prevTodos[dateString])];
            newTodos[index] = { ...newTodos[index], completed: !newTodos[index].completed };
            return { ...prevTodos, [dateString]: newTodos };
        });
    };

    const deleteTodo = (dateString, index) => {
        setTodos((prevTodos) => {
            const newTodos = [...(prevTodos[dateString])];
            newTodos.splice(index, 1);
            return { ...prevTodos, [dateString]: newTodos };
        });
    };

    const tileClassName = ({ date }) => {
        const dateString = date.toISOString().split('T')[0];
        return todos[dateString] ? 'has-todos' : null;
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={isDarkMode ? 'dark-mode' : ''}>
            <div className="container">
                <h1>To-Do List with Calendar</h1>
                <button onClick={toggleDarkMode}>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    tileClassName={tileClassName}
                />
                <div className="todo-list">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add a To-Do"
                    />
                    <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
                        <option value={1}>High Priority</option>
                        <option value={2}>Medium Priority</option>
                        <option value={3}>Low Priority</option>
                    </select>
                    <button onClick={addTodo}>Add</button>
                    <ul>
                        {(todos[date.toISOString().split('T')[0]] || []).map((todo, index) => (
                            <li key={index}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(date.toISOString().split('T')[0], index)}
                                />
                                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                    {todo.text} (Priority: {todo.priority})
                                </span>
                                <button onClick={() => deleteTodo(date.toISOString().split('T')[0], index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;