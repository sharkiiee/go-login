import { useRef, useState, useEffect } from "react";
import axios from "axios";
import goImage from "/go.jpeg";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OtpHandler from "../components/OtpHandler";
import ForgetPassword from "../components/ForgetPassword";
import SendOtp from "../components/SendOtp";

export default function AdminLoginPage() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [otpInputOpen, setOtpInputOpen] = useState(false);
  const [forgetInputOpen, setForgetInputOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [otpForLogin, setOtpForLogin] = useState(false);
  const [otpSendInputOpen, setOtpSendInputOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isValid && loginData && otpForLogin) {
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("username", loginData.username);
      localStorage.setItem("role", loginData.role);
      navigate("/admin/dashboard");
    }
  }, [isValid, loginData, otpForLogin, navigate]);

  async function onLoginButtonHandler(e) {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    console.log("inside onlogin");

    try {
      const response = await axios.post(
        "http://localhost:7070/login",
        {
          username: username,
          password: password,
          role: "admin",
        },
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );

      const data = response.data;

      if (data.success) {
        toast.success("Login Successful! Please verify OTP.");
        console.log("Login response data:", data);
        setLoginData({
          token: response.data.token,
          username: response.data.username,
          role: response.data.role,
        });
        setOtpForLogin(true);
        setOtpSendInputOpen(true);
      } else {
        toast.error("Login Failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response && error.response.data) {
        if (error.response.status === 401) {
          toast.error("Login Failed. Please check your credentials.");
        } else {
          toast.error(
            error.response.data.message ||
              "An error occurred. Please try again.",
          );
        }
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className=" bg-black border">
      {otpSendInputOpen && (
        <SendOtp
          setOtpSendInputOpen={setOtpSendInputOpen}
          setOtpInputOpen={setOtpInputOpen}
        />
      )}
      {forgetInputOpen && (
        <ForgetPassword setForgetInputOpen={setForgetInputOpen} />
      )}
      {otpInputOpen && (
        <OtpHandler
          setOtpInputOpen={setOtpInputOpen}
          setForgetInputOpen={setForgetInputOpen}
          setIsValid={setIsValid}
          isForLogin={otpForLogin}
        />
      )}
      <div className="pt-4 border">
        <img src={goImage} alt="goImage" className="rounded-full h-12 mx-7" />
      </div>
      <div className="bg-black w-full min-h-screen text-white flex flex-col mt-4 items-center gap-10">
        <div className="flex flex-col items-start gap-4 justify-center">
          <h2 className=" ml-8 text-8xl font-semibold mb-4  uppercase font-oswald">
            Welcome to the Admin Page
          </h2>
          <h3 className=" text-5xl italic font-playfair font-light lowercase text-center w-full">
            Build simple, secure, scalable systems with Go
          </h3>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="flex flex-col gap-6 bg-white w-2/3 rounded-md text-black p-8">
            <h1 className="text-4xl font-bold">Hi! Developer</h1>
            <form action="" className="flex flex-col gap-4 w-full ">
              <div className="flex flex-col gap-2 ">
                <label
                  htmlFor="username"
                  className="text-sm font-semibold text-black"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  ref={usernameRef}
                  className="px-4 py-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:border-red-500 focus:bg-white w-full text-black"
                  placeholder="Enter your username"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-black"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  ref={passwordRef}
                  className="px-4 py-2 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:border-red-500 focus:bg-white text-black"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                  onClick={onLoginButtonHandler}
                >
                  Login
                </button>
              </div>
              <button
                type="button"
                className="text-slate-800 hover:text-slate-700 hover:underline text-sm font-medium transition-colors mt-2"
                onClick={() => setOtpSendInputOpen(true)}
              >
                Forget Password ?
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
