import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "./types";
import dayjs from "dayjs";
import Tag from "./components/Tag.tsx";
import DueDateSelector from "./components/DueDateSelector";
function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [curTodoId, setCurTodoId] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const tags = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'shopping', label: 'Shopping' },
  ];

  async function fetchData() {
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  function handleSubmit() {
    if (!inputText || !selectedTag) return; //ensure data is not empty
    const data = {todoText: inputText, tag: selectedTag}
    if (mode === "ADD") {
      axios
        .request({
          url: "/api/todo",
          method: "put",
          data,
        })
        .then(() => {
          setInputText("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    } else {
      axios
        .request({
          url: "/api/todo",
          method: "patch",
          data: { id: curTodoId, todoText: inputText, tag: selectedTag },
        })
        .then(() => {
          setInputText("");
          setMode("ADD");
          setCurTodoId("");
        })
        .then(fetchData)
        .catch((err) => alert(err));
    }
  }

  function handleDelete(id: string) {
    axios
      .delete("/api/todo", { data: { id } })
      .then(fetchData)
      .then(() => {
        setMode("ADD");
        setInputText("");
      })
      .catch((err) => alert(err));
  }

  function handleCancel() {
    setMode("ADD");
    setInputText("");
    setCurTodoId("");
  }

  return (
    <div className="container">
      <header>
        <h1>Todo App</h1>
      </header>
      <main>
        <div style={{ display: "flex", alignItems: "start" }}>
          <input type="text" onChange={handleChange} value={inputText} data-cy="input-text"/>
          <DueDateSelector dueDate={dueDate} setDueDate={setDueDate}/>
          <Tag options={tags} selectedValue={selectedTag} onChange={setSelectedTag}/>
          <button onClick={handleSubmit} data-cy="submit">
            {mode === "ADD" ? "Submit" : "Update"}
          </button>
          {mode === "EDIT" && (
            <button onClick={handleCancel} className="secondary">
              Cancel
            </button>
          )}
        </div>
        <div data-cy="todo-item-wrapper">
          {todos.sort(compareDate).map((item, idx) => {
            const { date, time } = formatDateTime(item.createdAt);
            const text = item.todoText;
            return (
              <article
                key={item.id}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <div>({idx + 1})</div>
                <div>📅{date}</div>
                <div>⏰{time}</div>
                <div data-cy='todo-item-text'>📰{text}</div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setMode("EDIT");
                    setCurTodoId(item.id);
                    setInputText(item.todoText);
                  }}
                  data-cy="todo-item-update"
                >
                  {curTodoId !== item.id ? "🖊️" : "✍🏻"}
                </div>

                {mode === "ADD" && (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(item.id)}
                    data-cy='todo-item-delete'
                  >
                    🗑️
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;

function formatDateTime(dateStr: string) {
  if (!dayjs(dateStr).isValid()) {
    return { date: "N/A", time: "N/A" };
  }
  const dt = dayjs(dateStr);
  const date = dt.format("D/MM/YY");
  const time = dt.format("HH:mm");
  return { date, time };
}

function compareDate(a: TodoItem, b: TodoItem) {
  const da = dayjs(a.createdAt);
  const db = dayjs(b.createdAt);
  return da.isBefore(db) ? -1 : 1;
}
