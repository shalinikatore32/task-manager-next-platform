"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { updateTask } from "../../../store/tasksSlice";
import { RootState } from "../../../store/store";

export default function EditTask() {
  const router = useRouter();
  const { id } = useParams(); // Correct hook
  const dispatch = useAppDispatch();
  const task = useAppSelector(
    (state: RootState) => state.tasks.list.find((task) => task._id === id) // Use _id for MongoDB
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateTask({ _id: id as string, title, description, status }));
    router.push(`/tasks/new/${id}`); // Redirect after update
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 via-blue-300 to-purple-400 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full transform transition-all hover:scale-105"
      >
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">
          Edit Task
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            placeholder="Task Title"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            placeholder="Task Description"
          />
        </div>
        <div className="mb-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}
