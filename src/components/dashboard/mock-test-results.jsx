'use client';
import { useState } from "react";
import { FaPlus, FaCheckCircle } from "react-icons/fa";

export function MockTestResults() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete React Assignment", due: "Today", color: "red" },
    { id: 2, text: "Review Database Concepts", due: "Tomorrow", color: "yellow" },
    { id: 3, text: "Prepare Mock Interview", due: "This Week", color: "red" },
    { id: 4, text: "Read System Design Paper", due: "This Week", color: "green" },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newTaskObj = {
      id: tasks.length + 1,
      text: newTask,
      due: "No Deadline", 
      color: "blue", 
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="bg-gray-900 text-white p-5 rounded-xl w-96">
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 p-2 rounded-lg bg-gray-800 text-white outline-none"
        />
        <button onClick={addTask} className="ml-2 bg-green-500 p-2 rounded-lg hover:bg-green-600">
          <FaPlus className="text-white" />
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full bg-${task.color}-500 mr-2`}></span>
              <div>
                <p className="font-medium">{task.text}</p>
                <span className="text-sm text-gray-400">{task.due}</span>
              </div>
            </div>
            <FaCheckCircle className="text-gray-400 cursor-pointer hover:text-green-400" onClick={() => removeTask(task.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
