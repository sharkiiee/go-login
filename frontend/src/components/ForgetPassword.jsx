import { X } from "lucide-react";
import { useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgetPassword({ setForgetInputOpen }) {
  const usernameRef = useRef(null);
  const newPasswordRef = useRef(null);
  async function onPasswordSubmit(e) {
    e.preventDefault();

    const username = usernameRef.current.value;
    const newPassword = newPasswordRef.current.value;

    if (!username || !newPassword) {
      toast.error("Please enter both username and new password");
      return;
    }

    console.log("Sending data:", { username, newPassword });

    try {
      const response = await axios.post(
        "http://localhost:7070/forget-password",
        {
          username: username,
          newPassword: newPassword,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );

      console.log("Response:", response);
      const data = response.data;

      if (data.success) {
        toast.success("Password changed successfully!");
        usernameRef.current.value = "";
        newPasswordRef.current.value = "";
        setForgetInputOpen(false);
      } else {
        toast.error(data.message || "Password change failed");
      }
    } catch (error) {
      console.error("Password change error:", error);
      console.error("Error response:", error.response);
      if (error.response && error.response.data) {
        toast.error(
          error.response.data.message ||
            "Invalid username or password change failed",
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="fixed w-full h-screen top-0 left-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Change Password
          </h2>
          <X
            className="cursor-pointer hover:bg-gray-100 rounded transition-colors p-1 text-gray-500 hover:text-gray-800"
            onClick={() => {
              setForgetInputOpen(false);
            }}
            size={24}
          />
        </div>
        <form className="space-y-4" onSubmit={onPasswordSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              ref={usernameRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-black text-center"
              placeholder="Enter Username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              ref={newPasswordRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent text-black text-center"
              placeholder="Enter new password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-2.5 px-4 rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-sm"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
