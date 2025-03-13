"use client";
import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addTask } from "../../store/tasksSlice";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Task } from "../../store/types";

export type TaskWithoutId = Omit<Task, "_id">;

export default function NewTask() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  const validateForm = () => {
    if (title.trim() === "") {
      toast.error("Title is required.");
      return false;
    }
    if (title.length > 50) {
      toast.error("Title must be 50 characters or less.");
      return false;
    }
    if (description.trim() === "") {
      toast.error("Description is required.");
      return false;
    }
    if (description.length > 200) {
      toast.error("Description must be 200 characters or less.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const newTask: TaskWithoutId = { title, description, status };

      const resultAction = await dispatch(addTask(newTask)).unwrap();

      toast.success("Task created successfully!", {
        autoClose: 5000,
        position: "top-right",
      });

      router.push(`/tasks/new/${resultAction._id}`); // Redirect to the task detail page
    } catch (error) {
      toast.error(`Failed to create task. Please try again.`);
      console.error("Task creation error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 p-6">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full transform transition-all hover:scale-105"
      >
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
          Create New Task
        </h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>
        <div className="mb-6">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
        </div>
        <div className="mb-6">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
