import { useState } from "react";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import client from "apollo-client";
import Cookie from "js-cookie";
import { parseCookies } from "nookies";

import { buttonClasses, inputClasses } from "components/ReusableClasses";
import { baseUrl } from "utils/baseUrl";

const NewLesson = ({ categories, parsedUser }) => {
  const token = Cookie.get("elearning-jwt") && Cookie.get("elearning-jwt");
  const router = useRouter();

  const [values, setValues] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState(null);

  const { title, content } = values;

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!title || !content) {
      setError("All fields are required");
      return;
    }
    const data = {
      title,
      content,
    };
    // const formData = new FormData();
    // formData.append("files.image", image);
    // formData.append("data", JSON.stringify(data));
    setError(null);
    const res = await fetch(`${baseUrl}/courses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await res.json();
    if (res.ok) {
      setValues({
        title: "",
        content: "",
      });
      router.replace("/teach");
    } else {
      // console.log(result.message[0].messages[0].message);
      console.log(result);
    }
  };
  return (
    <div className="mt-20 py-3 px-10 max-w-lg mx-auto shadow-md bg-white">
      <h3 className="text-2xl font-medium text-center mb-3 text-gray-500">
        Create New Lesson
      </h3>
      <div className="mb-3 space-y-1">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className={inputClasses()}
          value={title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3 space-y-1">
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          cols="30"
          rows="2"
          className={inputClasses()}
          value={content}
          onChange={handleChange}
        />
      </div>
      {error && <div className="mb-3 text-center text-red-500">{error}</div>}
      <div className="mb-3 text-center">
        <button className={buttonClasses()} onClick={handleSubmit}>
          Create
        </button>
      </div>
    </div>
  );
};

export default NewLesson;

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
        categories {
          id
          title
        }
      }
    `,
  });
  return {
    props: { categories: data.categories, parsedUser },
  };
};
