export const toggleView = (prevView, setView) => {
  setView(prevView === "month" ? "year" : "month");
};