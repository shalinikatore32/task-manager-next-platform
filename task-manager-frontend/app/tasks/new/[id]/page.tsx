"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "../../../store/hooks";
import { Task } from "../../../store/types"; // Import the Task type

export default function TaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const task = useAppSelector((state) =>
    state.tasks.list.find((task: Task) => task._id === id)
  );

  const goBack = () => {
    router.push("/");
  };

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/tasks/edit/${id}`); // Navigate to the edit page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-green-700 mb-6">
          {task.title}
        </h1>
        <p className="text-lg text-gray-800 mb-4">{task.description}</p>
        <p className="text-md text-gray-600 mb-4">
          Status:{" "}
          <span
            className={`font-semibold ${
              task.status === "completed" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {task.status}
          </span>
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition transform hover:scale-105"
          >
            Edit Task
          </button>
          <button
            onClick={goBack}
            className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
