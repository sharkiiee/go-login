import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pen } from "lucide-react";
import { Trash2 } from "lucide-react";
import PostInput from "../components/PostInput";
import { UserStar } from "lucide-react";
import { Settings } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [postData, setPostData] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

  const [sendingFormFunction, setSendingFormFunction] = useState(null);
  const [formtype, setFormtype] = useState("");

  const [editPostData, setEditPostData] = useState({
    id: null,
    category: null,
    title: null,
    description: null,
    createdBy: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || localStorage.getItem("role") !== "admin") {
      navigate("/admin");
      return;
    }

    axios
      .get("http://localhost:7070/admin/verify", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("Token verification successful:", response.data);
      })
      .catch((error) => {
        console.error(
          "Token verification failed:",
          error.response?.data || error.message,
        );
        localStorage.removeItem("token");
        navigate("/admin");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  async function fetchPosts() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:7070/admin/getposts", {
        headers: {
          "content-type": "application/json",
          Authorization: token,
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

  function addHander() {
    setFormtype("Add new");
    setSendingFormFunction(() => submitPost);
    setIsEditOpen(!isEditOpen);
  }

  async function submitPost(postData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:7070/admin/addpost",
        postData,
        {
          headers: {
            "content-type": "application/json",
            Authorization: token,
          },
        },
      );
      console.log(response);
      fetchPosts();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  }

  async function deleteHandler(postId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:7070/admin/deletepost`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: token,
          },
          data: {
            id: postId,
          },
        },
      );
      console.log(response);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  function onEditPostHandler(id, title, description, createdBy, category) {
    setEditPostData(() => {
      return {
        id: id,
        title: title,
        description: description,
        category: category,
        createdBy: createdBy,
      };
    });
    setFormtype("Edit Post");
    setSendingFormFunction(() => shareUpdateData);
    setIsEditOpen(() => {
      return !isEditOpen;
    });
  }

  async function shareUpdateData(postData) {
    console.log("inside share update data", postData);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:7070/admin/updatepost",
        postData,
        {
          headers: {
            "content-type": "application/json",
            Authorization: token,
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Post updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update post");
      }

      fetchPosts();
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(error.response?.data?.message || "Error updating post");
    }
  }

  return (
    <div className="bg-gray-100 w-full flex">
      {isEditOpen && (
        <PostInput
          setIsEditOpen={setIsEditOpen}
          getPost={sendingFormFunction}
          formtype={formtype}
          editPostData={editPostData}
          setEditPostData={setEditPostData}
        />
      )}
      <div className="w-1/5 bg-black text-white flex flex-col justify-between">
        <div className="pl-7 pt-6 font-medium tracking-widest  uppercase font-oswald flex gap-3 items-center">
          <UserStar size={35} className="bg-white text-black p-1 rounded" />
          <div className="text-4xl">Admin</div>
        </div>
      </div>
      <div className="px-13 w-full">
        <div className="flex justify-between w-full items-center pt-6">
          <h1 className="text-9xl font-semibold">POSTS</h1>
          <div className="flex flex-col gap-3 group overflow-hidden">
            <Settings
              size={28}
              strokeWidth={1.5}
              className="bg-black text-white rounded-full p-1 cursor-pointer hover:text-gray-600 transition-all ease-in self-end mt-4"
            />
            <button
              className=" bg-black text-white py-1 px-5 translate-x-40
      group-hover:translate-x-1
      transition-transform
      duration-300
      ease-out"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="border-[0.5px] px-4 text-xl py-1 font-extralight hover:font-light hover:border transition-all ease-in"
              onClick={addHander}
            >
              New Post
            </button>
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
                    Created BY
                    <span className="text-gray-600 uppercase text-xs">
                      {" " + post.createdBy}
                    </span>
                  </div>
                  <div className="flex gap-3 text-gray-600">
                    <Pen
                      size={18}
                      className="mt-2 cursor-pointer"
                      onClick={() =>
                        onEditPostHandler(
                          post.id,
                          post.title,
                          post.description,
                          post.createdBy,
                          post.category,
                        )
                      }
                    />
                    <Trash2
                      size={35}
                      onClick={() => deleteHandler(post.id)}
                      className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* ////////////// */}
      </div>
    </div>
  );
}
