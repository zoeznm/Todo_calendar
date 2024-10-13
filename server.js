const path = require('path');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // MySQL 사용자 이름
    password: 'Duddbqh231!!', // MySQL 비밀번호
    database: 'todo' // 사용할 데이터베이스 이름
});

// 연결 확인
db.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패:', err.stack);
        return;
    }
    console.log('데이터베이스에 연결됨');
});

// 수정된 경로: todo-calendar/build 폴더 내의 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'todo-calendar', 'build')));

// 특정 날짜의 todos를 가져오는 API
app.get('/api/todos/:date', (req, res) => {
    const date = req.params.date;
    db.query('SELECT * FROM todos WHERE date = ?', [date], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 특정 날짜의 todo 추가 API
app.post('/api/todos/:date', (req, res) => {
    const date = req.params.date; // 클라이언트에서 받은 날짜
    const { content, priority } = req.body;
    console.log('Received date:', date); // 날짜 출력
    const sql = 'INSERT INTO todos (date, content, priority) VALUES (?, ?, ?)';
    db.query(sql, [date, content, priority], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, date, content, priority });
    });
});

// 특정 날짜의 todo 삭제 API
app.delete('/api/todos/:date/:id', (req, res) => {
    const id = req.params.id;
    console.log('Deleting todo with ID:', id); // ID 확인을 위한 로그 추가
    const sql = 'DELETE FROM todos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('삭제 중 오류 발생:', err.message); // 오류 메시지 로그
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Todo not found'); // 삭제할 항목이 없을 때
        }
        res.status(204).send(); // 삭제 성공
    });
});

// 나머지 모든 경로에 대해 index.html 반환
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'todo-calendar', 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 실행 중입니다.`);
});