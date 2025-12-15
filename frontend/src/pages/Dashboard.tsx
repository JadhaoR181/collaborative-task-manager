import { useState } from "react";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";
import CreateTaskModal from "../components/CreateTaskModal";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            + Create Task
          </button>
        </div>

        <TaskList />
      </main>

      {open && <CreateTaskModal onClose={() => setOpen(false)} />}
    </div>
  );
}
