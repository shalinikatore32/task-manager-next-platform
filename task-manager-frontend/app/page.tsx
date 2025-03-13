"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchTasks, deleteTask, updateTask } from "./store/tasksSlice";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Task } from "./store/types";

interface TooltipProps {
  children: ReactNode;
  text: string;
}

const TASKS_PER_PAGE = 6;

// ToggleSwitch Component

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: () => void;
}
function ToggleSwitch({ isChecked, onChange }: ToggleSwitchProps) {
  return (
    <div
      onClick={onChange}
      className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
        isChecked ? "bg-green-500" : "bg-yellow-500"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
          isChecked ? "translate-x-6" : "translate-x-0"
        } transition-transform duration-300`}
      ></div>
    </div>
  );
}

// Tooltip Component
function Tooltip({ children, text }: TooltipProps) {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
        {text}
      </div>
    </div>
  );
}

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tasks = useAppSelector((state) => state.tasks.list);
  const taskStatus = useAppSelector((state) => state.tasks.status);

  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (taskStatus === "idle") {
      dispatch(fetchTasks());
    }
  }, [taskStatus, dispatch]);

  const handleCreateTask = () => {
    router.push("/tasks/new");
    toast.success("Redirecting to create a new task!");
  };

  const handleTaskClick = (id: string) => {
    router.push(`/tasks/new/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/tasks/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    // Optimistically update the UI
    dispatch(deleteTask(id))
      .unwrap()
      .then(() => {
        toast.success("Task deleted successfully!");
        dispatch(fetchTasks());
      })
      .catch((error) => {
        toast.error(`Failed to delete task: ${error}`);
      });
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    await dispatch(updateTask({ ...task, status: newStatus }));
    dispatch(fetchTasks());
    toast.info(`Task marked as ${newStatus}!`);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearchQuery = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilterStatus =
      filterStatus === "all" || task.status === filterStatus;

    return matchesSearchQuery && matchesFilterStatus;
  });

  const tasksToDisplay =
    activeTab === "new"
      ? filteredTasks.filter((task) => task.status === "pending")
      : filteredTasks.filter((task) => task.status === "completed");

  const totalPages = Math.ceil(tasksToDisplay.length / TASKS_PER_PAGE);
  const paginatedTasks = tasksToDisplay.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-50 to-indigo-100 text-black"
      } p-4 md:p-8`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-900">
          Welcome to Task Manager
        </h1>
        <div className="flex justify-end mb-4 w-full">
          <Tooltip
            text={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="flex items-center">
              <ToggleSwitch
                isChecked={isDarkMode}
                onChange={handleToggleDarkMode}
              />
            </div>
          </Tooltip>
        </div>
        <p className="text-lg text-gray-700 mt-2">
          Manage your tasks efficiently and effectively.
        </p>
      </motion.div>
      <div className="flex justify-center mb-8 md:mb-12">
        <button
          onClick={handleCreateTask}
          className="bg-indigo-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Create New Task
        </button>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-black"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-black"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => handleTabChange("new")}
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "new"
                ? "text-indigo-700 border-b-2 border-indigo-700"
                : "text-gray-500 hover:text-indigo-700 hover:border-indigo-700"
            } transition`}
          >
            New Tasks
          </button>
          <button
            onClick={() => handleTabChange("completed")}
            className={`px-4 py-2 text-lg font-semibold ${
              activeTab === "completed"
                ? "text-green-700 border-b-2 border-green-700"
                : "text-gray-500 hover:text-green-700 hover:border-green-700"
            } transition`}
          >
            Completed Tasks
          </button>
        </div>
        <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6 overflow-x-auto max-w-full">
          {paginatedTasks.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Toggle Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-black">
                {paginatedTasks.map((task) => (
                  <tr key={task._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleTaskClick(task._id)}
                        title="View Task"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <EyeIcon className="h-5 w-5 inline" />
                      </button>
                      <button
                        onClick={() => handleEdit(task._id)}
                        title="Edit Task"
                        className="text-green-600 hover:text-green-900 ml-4"
                      >
                        <PencilIcon className="h-5 w-5 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        title="Delete Task"
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <TrashIcon className="h-5 w-5 inline" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <ToggleSwitch
                        isChecked={task.status === "completed"}
                        onChange={() => handleToggleStatus(task)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No tasks available in this section.
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-lg font-semibold rounded-full transition ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Previous
            </button>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 text-lg font-semibold rounded-full transition ${
                    currentPage === index + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-lg font-semibold rounded-full transition ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
