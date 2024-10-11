// src/TodoList.js
import React, { useState } from 'react';
import styles from './App.css';

function TodoList({ date, todos, setTodos }) {
    const [todoInput, setTodoInput] = useState('');

    const handleAddTodo = () => {
        const dateString = date.toLocaleDateString();
        const newTodos = { ...todos, [dateString]: [...(todos[dateString] || []), todoInput] };
        setTodos(newTodos);
        setTodoInput('');
    };

    const handleDeleteTodo = (index) => {
        const dateString = date.toLocaleDateString();
        const newTodos = { ...todos };
        newTodos[dateString].splice(index, 1);
        setTodos(newTodos);
    };

    const dateString = date.toLocaleDateString();
    return (
        <div>
            <h2>{dateString} To-Do List</h2>
            <input
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                placeholder="Add a new todo"
            />
            <button className={styles.btn} onClick={handleAddTodo}>Add</button>
            <ul>
                {todos[dateString] && todos[dateString].map((todo, index) => (
                    <li key={index}>
                        {todo}
                        <button className={styles.btn} onClick={() => handleDeleteTodo(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;