import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);
  return (
    <div className="bg-blue-900 w-full h-screen text-white flex justify-center items-center">
      <h1 className="text-5xl font-bold">Welcome to the Dashboard!</h1>
    </div>
  );
}