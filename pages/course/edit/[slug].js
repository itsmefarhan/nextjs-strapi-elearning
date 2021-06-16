import { useState } from "react";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import client from "apollo-client";
import Cookie from "js-cookie";
import { parseCookies } from "nookies";
import slugify from "slugify";
import { buttonClasses, inputClasses } from "components/ReusableClasses";
import { baseUrl } from "utils/baseUrl";

const EditCourse = ({ categories, course, parsedUser }) => {
  const token = Cookie.get("elearning-jwt") && Cookie.get("elearning-jwt");
  const router = useRouter();

  const [values, setValues] = useState({
    title: course?.title,
    description: course?.description,
    category: course?.category.title,
    image: "",
    price: course?.price,
  });
  const [error, setError] = useState(null);

  const { title, description, price, category, image } = values;

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !price) {
      setError("All fields are required");
      return;
    }
    const data = {
      title,
      slug: slugify(title, {
        lower: true,
      }),
      description,
      category,
      price,
      instructor: parsedUser.id,
    };
    setError(null);

    const res = await fetch(`${baseUrl}/courses/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) {
      setValues({
        title: "",
        category: "",
        description: "",
        image: "",
        price: "",
      });
      router.replace("/course/teach");
    } else {
      // console.log(result.message[0].messages[0].message);
      console.log(result);
    }
  };
  return (
    <div className="mt-20 py-3 px-10 max-w-lg mx-auto shadow-md bg-white">
      <h3 className="text-2xl font-medium text-center mb-3 text-gray-500">
        Edit Course
      </h3>
      <div className="mb-3 text-center">
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange("image")}
        />
      </div>
      <div className="mb-3 space-y-1">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className={inputClasses()}
          value={title}
          onChange={handleChange("title")}
        />
      </div>
      <div className="mb-3 space-y-1">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          cols="30"
          rows="2"
          className={inputClasses()}
          value={description}
          onChange={handleChange("description")}
        />
      </div>
      <div className="mb-3 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="space-y-1 mb-3 md:mb-0">
          <label htmlFor="category">Category</label>
          <br />
          <select
            name="category"
            className={
              "p-1.5 rounded-md outline-none bg-white border-2 border-gray-300 w-full"
            }
            onChange={handleChange("category")}
          >
            <option value="">Select Category</option>
            {categories?.map((category) => (
              <option value={category.id} key={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1 md:ml-3">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            className={inputClasses()}
            value={price}
            onChange={handleChange("price")}
          />
        </div>
      </div>
      {error && <div className="mb-3 text-center text-red-500">{error}</div>}
      <div className="mb-3 text-center">
        <button className={buttonClasses()} onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
};

export default EditCourse;

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
        courses(where: { slug: "${ctx.query.slug}" }) {
          id
          slug
          title
          description
          price          
          category {
            title
            id
          }
          image {
            url
          }
          instructor {
            username
            id
          }
          lessons {
            id
            title
            content
          }
        }
      }
    `,
  });

  if (data.courses[0].instructor.id !== parsedUser.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { categories: data.categories, course: data.courses[0], parsedUser },
  };
};
