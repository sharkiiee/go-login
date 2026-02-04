import { X } from "lucide-react";
import { useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function OtpHandler({
  setOtpInputOpen,
  setForgetInputOpen,
  setIsValid,
  isForLogin = false,
}) {
  const usernameRef = useRef(null);
  const otpRef = useRef(null);

  async function onVerifySubmit(e) {
    e.preventDefault();

    const username = usernameRef.current.value;
    const otp = otpRef.current.value;

    if (!username || !otp) {
      toast.error("Please enter both username and OTP");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7070/verifyotp",
        {
          username: username,
          otp: otp,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );

      const data = response.data;

      if (data.success) {
        toast.success("OTP verified successfully!");
        setOtpInputOpen(false);

        if (isForLogin) {
          // For login flow: just set isValid to trigger navigation
          setIsValid(true);
        } else {
          // For forget password flow: open ForgetPassword modal
          setForgetInputOpen(true);
        }
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Invalid OTP or username");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="fixed w-full h-screen top-0 left-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Verification</h2>
          <X
            className="cursor-pointer hover:bg-gray-100 rounded transition-colors p-1 text-gray-500 hover:text-gray-800"
            onClick={() => setOtpInputOpen(false)}
            size={24}
          />
        </div>
        <form className="space-y-4" onSubmit={onVerifySubmit}>
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
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              ref={otpRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent tracking-widest text-center text-lg text-black"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-2.5 px-4 rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-sm"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
