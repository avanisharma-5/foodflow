import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to FoodFlow </h1>
      <p className="text-lg text-gray-600 mt-2">Donate your food easily.</p>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO2yZiSW7IBivbqi3erO9-omVDLsHDU4xzTO-qKfo_q6kULOkkhSJZRssBj9QVBxWB53Q&usqp=CAU"  ></img>
      <Link to="/signup" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
       New User?Register
      </Link>
    </div>
  );
};

export default Home;