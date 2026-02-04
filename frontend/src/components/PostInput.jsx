import { X } from "lucide-react";
import { useRef } from "react";
export default function PostInput({
  setIsEditOpen,
  getPost,
  formtype,
  editPostData,
  setEditPostData,
}) {
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const contentRef = useRef(null);
  const createdbyRef = useRef(null);

  const inputStyle =
    "w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-400";

  function onaddPostHandler(e) {
    e.preventDefault();

    const title = titleRef.current.value;
    const category = categoryRef.current.value;
    const description = contentRef.current.value;
    const createdBy = createdbyRef.current.value;

    const postData = {
      ...(editPostData?.id && { id: editPostData.id }),
      title,
      category,
      description,
      createdBy,
    };

    setEditPostData({
      id: null,
      category: null,
      title: null,
      description: null,
      createdBy: null,
    });

    getPost(postData);
  }

  return (
    <div className="fixed w-full h-screen top-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white p-6 rounded-xl shadow-md w-3/4 lg:w-2/4 space-y-4 px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className=" text-2xl font-bold capitalize">{formtype}</h1>
            <p className="first-letter:uppercase text-sm text-gray-700">
              Enter post details
            </p>
          </div>
          <X
            size={35}
            className="cursor-pointer hover:text-gray-800 rounded transition-colors p-1 text-stone-500"
            onClick={() => setIsEditOpen(false)}
          />
        </div>
        {/* Form for the data */}
        <form onSubmit={onaddPostHandler}>
          <div className="grid gap-6">
            <div>
              <label htmlFor="title" className="font-medium">
                Post Title
              </label>
              <br />
              <input
                type="text"
                id="title"
                ref={titleRef}
                defaultValue={editPostData?.title || ""}
                className={inputStyle}
                placeholder="Enter Post Title"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="font-medium">
                Category
              </label>
              <br />
              <select
                name="category"
                id="category"
                ref={categoryRef}
                defaultValue={editPostData?.category || ""}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-400 text-gray-700 font-light"
                required
              >
                <option className="text-gray-700" value="">
                  Select Category
                </option>
                <option className="text-gray-700" value="technology">
                  Technology
                </option>
                <option className="text-gray-700" value="lifestyle">
                  Lifestyle
                </option>
                <option className="text-gray-700" value="business">
                  Business
                </option>
                <option className="text-gray-700" value="entertainment">
                  Entertainment
                </option>
                <option className="text-gray-700" value="sports">
                  Sports
                </option>
              </select>
            </div>

            <div>
              <label htmlFor="content" className="font-medium">
                Content
              </label>
              <br />
              <textarea
                id="content"
                rows="6"
                ref={contentRef}
                defaultValue={editPostData?.description || ""}
                className={inputStyle}
                placeholder="Enter Post Content"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="createdby" className="font-medium">
                Created By / Credit to:
              </label>
              <br />
              <input
                type="text"
                id="createdby"
                ref={createdbyRef}
                defaultValue={editPostData?.createdBy || ""}
                className={inputStyle}
                placeholder="Enter tags separated by commas"
                required
              />
            </div>
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="mt-4 bg-slate-950 hover:bg-slate-800 text-white font-medium px-6 py-2 rounded transition-colors"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
