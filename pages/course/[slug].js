import { useState } from "react";
import Cookie from "js-cookie";
import { parseCookies } from "nookies";
import { gql } from "@apollo/client";
import client from "apollo-client";
import { baseUrl } from "utils/baseUrl";
import RenderCourse from "components/Course/Course";
import NewLesson from "components/Course/NewLesson";
import Lesson from "components/Course/Lesson";

const Course = ({ course }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
  });

  const [lessonIndex, setLessonIndex] = useState(0);

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
      <RenderCourse course={course} />
      <hr />
      <NewLesson
        course={course}
        openModal={openModal}
        closeModal={closeModal}
        customStyles={customStyles}
        isOpen={isOpen}
        values={values}
        error={error}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      {/* Display Lessons */}
      {course.lessons?.map((lesson, i) => (
        <Lesson
          key={lesson.id}
          lesson={lesson}
          lessonIndex={lessonIndex}
          setLessonIndex={setLessonIndex}
          i={i}
        />
      ))}
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
            lessons {
              id
              title
              content
            }
          }
        }
      `,
  });

  return {
    props: { course: data.courses[0] },
  };
};
