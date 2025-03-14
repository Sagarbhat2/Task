"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


export default function Auth() {
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const router = useRouter();


const handleSubmit= async (e)=>{
    e.preventDefault();
    const res = await fetch("http://localhost:5000/register", {  
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({ name, email, password })
    });   
   const data= await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token); // Store JWT token
      router.push("/dashboard");
    } else {
      alert(data.message || "register failed");
    }}

  return (
    <div className="flex h-screen items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://img.freepik.com/free-vector/digital-technology-background-with-blue-orange-light-effect_1017-27423.jpg?t=st=1741890277~exp=1741893877~hmac=2034c80a9662a8a5bd3788528751a3b84ab539a2fb0c8cde8fc87a95f4fdb7e1&w=1060)' }}>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
      
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={(e)=>{setname(e.target.value)}}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>{setemail(e.target.value)}}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>{setpassword(e.target.value)}}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
         Sign Up
          </button>
        </form>
        <p className="mt-4 text-gray-600">
      Already have an account?
      <Link href="/login">
           <span
            className="text-blue-500 cursor-pointer ml-1"
          >
           LogIn
          </span>
           </Link>
        </p>
      </div>
    </div>
  );
}
