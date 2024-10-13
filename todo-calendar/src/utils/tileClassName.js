export const tileClassName = (activeDate) => ({ date }) => {
  const dateString = date.toISOString().split("T")[0];

  if (activeDate === dateString) return "active-date"; // 클릭한 날짜만 클래스 적용
  return null; // 기타 색상 변경 없음
};