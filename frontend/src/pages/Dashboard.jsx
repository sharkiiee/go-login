import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  
import PostInput from "../components/PostInput";
import { UserStar } from 'lucide-react';
import { Settings } from 'lucide-react';


export default function Dashboard() {
    const [postData, setPostData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);

    async function fetchPosts() {
    try {
      const response = await axios.get("http://localhost:7070/admin/getposts", {
        headers: {
          "content-type": "application/json",
        },
      });
      console.log(response);
      const data = response.data;
      setPostData(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

          const handleLogout = () => {
          localStorage.removeItem("token");
          navigate("/admin");
        };


  return (
    <div className="bg-gray-100 w-full flex">
      <div className="w-1/5 bg-black text-white flex flex-col justify-between">
        <div className="pl-7 pt-6 font-medium tracking-widest  uppercase font-oswald flex gap-3 items-center">
          <UserStar size={35} className="bg-white text-black p-1 rounded"/>
          <div className="text-4xl">user</div>
        </div>
      </div>
      <div className="px-13 w-full">
        <div className="flex justify-between w-full items-center pt-6">
          <h1 className="text-9xl font-semibold">POSTS</h1>
          <div className="flex flex-col gap-3 group overflow-hidden">
            <Settings size={28} strokeWidth={1.5} className="bg-black text-white rounded-full p-1  self-end mt-4"/>
            <button className=" bg-black text-white py-1 px-5 translate-x-40
      group-hover:translate-x-1
      transition-transform
      duration-300
      ease-out" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* ////////////// */}

        <div className="mb-9">
          {postData.map((post) => {
            return (
              <div
                key={post.id}
                className="bg-white h-fit px-13 py-6 rounded mt-5 flex flex-col gap-3"
              >
                <div className="bg-black text-white w-fit px-2 text-sm py-1">
                  {post.category}
                </div>
                <div className="w-11/12">
                  <h2 className="text-3xl font-medium">{post.title}</h2>
                  <p className="text-sm text-gray-600 py-2 w-full">
                    {post.description}
                  </p>
                </div>
                <div className="flex justify-between w-full">
                  <div className="text-sm">
                    Created BY{" "}
                    <span className="text-gray-600 uppercase text-xs">
                      {post.createdBy}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}