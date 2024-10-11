import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
    const [date, setDate] = useState(new Date());
    const [todos, setTodos] = useState({});
    const [input, setInput] = useState('');

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
                { text: input, completed: false },
            ],
        }));
        setInput('');
    };

    const toggleTodo = (dateString, index) => {
        setTodos((prevTodos) => {
            const newTodos = [...(prevTodos[dateString])]; // 기존 투두 리스트 복사
            newTodos[index] = { ...newTodos[index], completed: !newTodos[index].completed }; // completed 상태 토글
            return { ...prevTodos, [dateString]: newTodos }; // 업데이트된 투두 리스트 반환
        });
    };

    const deleteTodo = (dateString, index) => {
        setTodos((prevTodos) => {
            const newTodos = [...(prevTodos[dateString])]; // 기존 투두 리스트 복사
            newTodos.splice(index, 1); // 삭제할 인덱스의 항목 삭제
            return { ...prevTodos, [dateString]: newTodos }; // 업데이트된 투두 리스트 반환
        });
    };

    const tileClassName = ({ date }) => {
        const dateString = date.toISOString().split('T')[0];
        return todos[dateString] ? 'has-todos' : null; // 해당 날짜에 투두가 있으면 클래스 추가
    };

    return (
        <div>
            <h1>To-Do List with Calendar</h1>
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
                <button onClick={addTodo}>Add</button>
                <ul>
                    {(todos[date.toISOString().split('T')[0]] || []).map((todo, index) => (
                        <li key={index}>
                            <input
                                type="checkbox"
                                checked={todo.completed} // 체크박스 상태를 todo.completed에 바인딩
                                onChange={() => toggleTodo(date.toISOString().split('T')[0], index)} // 체크박스 클릭 시 toggleTodo 호출
                            />
                            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                {todo.text}
                            </span>
                            <button onClick={() => deleteTodo(date.toISOString().split('T')[0], index)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;