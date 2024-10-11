import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 달력 CSS 스타일 import
import './App.css'; // CSS 파일 import

function App() {
    const [date, setDate] = useState(new Date());
    const [todos, setTodos] = useState({});
    const [input, setInput] = useState('');

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const addTodo = () => {
        if (!input) return;
        const dateString = date.toISOString().split('T')[0]; // 날짜를 'YYYY-MM-DD' 형식으로 변환
        setTodos((prevTodos) => ({
            ...prevTodos,
            [dateString]: [...(prevTodos[dateString] || []), input],
        }));
        setInput('');
    };

    const deleteTodo = (dateString, index) => {
        setTodos((prevTodos) => {
            const newTodos = [...prevTodos[dateString]];
            newTodos.splice(index, 1);
            return { ...prevTodos, [dateString]: newTodos };
        });
    };

    // 특정 날짜에 색상 적용
    const tileClassName = ({ date }) => {
        const dateString = date.toISOString().split('T')[0];
        if (todos[dateString]) {
            return 'has-todos'; // 색상을 적용할 클래스 이름
        }
    };

    return (
        <div>
            <h1>To-Do List with Calendar</h1>
            <Calendar
                onChange={handleDateChange}
                value={date}
                tileClassName={tileClassName} // 클래스 이름 설정
            />
            <div className="todo-list">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a To-Do"
                />
                <button onClick={addTodo}>Add</button>
                <ul>
                    {(todos[date.toISOString().split('T')[0]] || []).map((todo, index) => (
                        <li key={index}>
                            {todo}
                            <button onClick={() => deleteTodo(date.toISOString().split('T')[0], index)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;