import { useState } from "react";
import Image from "next/image";
import Cookie from "js-cookie";
import { parseCookies } from "nookies";
import Modal from "react-modal";
import { gql } from "@apollo/client";
import client from "apollo-client";
import { inputClasses } from "components/ReusableClasses";
import { baseUrl } from "utils/baseUrl";

const Course = ({ course }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
  });

  const [error, setError] = useState(null);

  const { title, content } = values;

  const token = Cookie.get("elearning-jwt") && Cookie.get("elearning-jwt");

  const customStyles = {
    overlay: {
      backgroundColor: "rgb(31, 41, 55)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  Modal.setAppElement("#__next");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(null);
    if (!title || !content) {
      setError("All fields are required");
      return;
    }
    // Create lesson
    const lessonRes = await fetch(`${baseUrl}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });
    const lessonResult = await lessonRes.json();

    // Add lesson into course
    const res = await fetch(`${baseUrl}/courses/${course.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lessonResult),
    });
    await res.json();
    if (res.ok) {
      setValues({ title: "", content: "" });
      setIsOpen(false);
      setError(null);
    }
  };

  return course ? (
    <div className="max-w-4xl mx-auto mt-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-xl font-medium">{course.title}</h3>
          <p className="mb-2">By {course.instructor.username}</p>
          <small className="bg-gray-300 text-gray-700 p-2 rounded-md">
            {course.category.title}
          </small>
        </div>
        <div className="flex md:justify-between items-center space-x-2 mt-4 sm:mt-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          <button className="border border-yellow-500 py-1 px-4 rounded-md transition duration-300 hover:bg-yellow-500 hover:text-white focus:outline-none">
            Publish
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      </div>
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Image
            src={course.image.url}
            layout="responsive"
            width={100}
            height={100}
          />
        </div>
        <div>
          <p>{course.description}</p>
        </div>
      </div>
      <hr />
      <div className="flex justify-between items-center my-4">
        <div>
          <h3 className="text-xl font-medium">Lessons</h3>
        </div>
        <div>
          <button
            className="border border-yellow-500 py-1 px-4 rounded-md transition duration-300 hover:bg-yellow-500 hover:text-white focus:outline-none"
            onClick={openModal}
          >
            New Lesson
          </button>
        </div>
        {/* New Lesson Modal */}
        <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="New Lesson Modal"
        >
          <div>
            <div className="mb-3 flex justify-between items-center">
              <h3 className="text-xl font-medium">Add New Lesson</h3>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white py-0.5 px-2 rounded-md"
              >
                X
              </button>
            </div>
            <div className="mb-3">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                className={inputClasses()}
                value={title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content">Content</label>
              <textarea
                name="content"
                className={inputClasses()}
                value={content}
                onChange={handleChange}
              />
            </div>
          </div>
          {error && (
            <div className="mb-3 text-center text-red-500">{error}</div>
          )}
          <div className="text-center mb-3">
            <button
              className="border border-yellow-500 py-1 px-4 rounded-md transition duration-300 hover:bg-yellow-500 hover:text-white focus:outline-none"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </Modal>
      </div>
    </div>
  ) : null;
};

export default Course;

export const getServerSideProps = async (ctx) => {
  const authData = parseCookies(ctx);

  const user = authData["elearning-user"];
  const parsedUser = user && JSON.parse(user);

  if (!parsedUser.educator) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data } = await client.query({
    query: gql`
        {
          courses(where: { slug: "${ctx.query.slug}" }) {
            id
            slug
            title
            description
            category {
              title
            }
            image {
              url
            }
            instructor {
              username
              id
            }
          }
        }
      `,
  });

  return {
    props: { course: data.courses[0] },
  };
};
