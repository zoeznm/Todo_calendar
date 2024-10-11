const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // JSON 요청 본문을 파싱

let todos = {}; // 메모리 내 저장소 (나중에 데이터베이스로 변경 가능)

// 특정 날짜의 todos를 가져오는 API
app.get('/api/todos/:date', (req, res) => {
    const date = req.params.date;
    res.json(todos[date] || []);
});

// 특정 날짜의 todo 추가 API
app.post('/api/todos/:date', (req, res) => {
    const date = req.params.date;
    const { content } = req.body;
    if (!todos[date]) {
        todos[date] = [];
    }
    todos[date].push(content);
    res.status(201).json(todos[date]);
});

// 특정 날짜의 todo 삭제 API
app.delete('/api/todos/:date/:index', (req, res) => {
    const date = req.params.date;
    const index = parseInt(req.params.index);
    if (todos[date] && todos[date][index]) {
        todos[date].splice(index, 1);
        res.status(204).send(); // 삭제 성공
    } else {
        res.status(404).send('Todo not found');
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});