import axios from 'axios';

/**
 * 새로운 할 일을 추가하는 함수
 * @param {string} input - 할 일 내용
 * @param {string} date - 할 일을 추가할 날짜
 * @param {string} priority - 할 일 우선순위
 */

export const addTodo = async (input, date, priority) => {
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
    // 추가적인 로직 (예: 상태 업데이트 등)
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};