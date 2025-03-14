"use client"

import React, { useState, useEffect } from "react";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:5000/tasks"); 
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("❌ Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading tasks...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Assigned Tasks</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Task ID</th>
            <th className="border p-2">Agent Name</th>
            <th className="border p-2">Agent Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id} className="border">
                <td className="border p-2">{task._id}</td>
                <td className="border p-2">{task.assignedAgent?.name || "Unassigned"}</td>
                <td className="border p-2">{task.assignedAgent?.email || "N/A"}</td>
                <td className="border p-2">{task.phone}</td>
                <td className="border p-2">{task.notes}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No tasks available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TasksPage;
