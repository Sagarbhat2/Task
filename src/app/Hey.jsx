"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [mobile, setmobile] = useState("");
  const [password, setpassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, mobile, password }),
    });
    let data = await res.json();

    if (!res.ok) {
      throw new Error("Failed to add agent");
    }

    setMessage("Agent added successfully!");
    setname("");
    setemail("");
    setmobile("");
    setpassword("");
    setTimeout(() => {
      setShowForm(false);
      setMessage("");
    }, 2000);
  };

  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    console.log(file);
  }, [file]);

  const handleUpload = async () => {
    if (!file) return setMessages("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessages("File uploaded successfully!");
    } catch (error) {
      setMessages(error.message);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
      style={{
        backgroundImage:
          "url(https://static.vecteezy.com/system/resources/previews/048/238/573/non_2x/abstract-futuristic-technology-blank-wallpaper-free-vector.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-2xl font-bold text-white mb-8 text-center">
        Welcome to Dashboard Page
      </h1>

      {/* Upload Section */}
      <div className="flex flex-col sm:w-full md:w-96 items-center bg-white p-6 rounded-lg shadow-md">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white w-full py-2 rounded mt-3 hover:bg-blue-600 transition"
        >
          Upload File
        </button>
        {messages && <p className="text-red-500 mt-2">{messages}</p>}
      </div>

      {/* Buttons Section */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition w-48 text-center"
        >
          Add Agent
        </button>

        <button
          onClick={() => router.push("/TaskPage")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition w-48 text-center"
        >
          View Tasks
        </button>
      </div>

      {/* Add Agent Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Agent</h2>
            {message && <p className="text-green-500 text-center">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="+91-9876543210"
                value={mobile}
                onChange={(e) => setmobile(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Add Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
