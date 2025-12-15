import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <TaskList />
      </main>
    </div>
  );
}
