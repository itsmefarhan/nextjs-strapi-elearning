import { useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import { parseCookies } from "nookies";
import { gql } from "@apollo/client";
import client from "apollo-client";
import { baseUrl } from "utils/baseUrl";
import RenderCourse from "components/Course/Course";
import NewLesson from "components/Course/NewLesson";
import Lesson from "components/Course/Lesson";

const Course = ({ course }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
  });

  const [thecourse, setTheCourse] = useState(course);

  const [lessonIndex, setLessonIndex] = useState(0);

  const [error, setError] = useState(null);

  const { title, content } = values;

  const token = Cookie.get("elearning-jwt") && Cookie.get("elearning-jwt");
  const user =
    Cookie.get("elearning-user") && JSON.parse(Cookie.get("elearning-user"));

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
      setTheCourse({
        ...course,
        lessons: thecourse.lessons.concat(lessonResult),
      });
      setValues({ title: "", content: "" });
      setIsOpen(false);
      setError(null);
    }
  };

  // Delete lesson
  const deleteLesson = async (lessonId) => {
    const confirm = window.confirm("Delete Lesson?");
    if (confirm) {
      const res = await fetch(`${baseUrl}/lessons/${lessonId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await res.json();
      if (res.ok) {
        const updatedLessons = thecourse.lessons.filter(
          (lesson) => lesson.id !== lessonId
        );
        setTheCourse({ ...course, lessons: updatedLessons });
      }
    }
  };

  // Delete Course
  const deleteCourse = async (course) => {
    if (course.instructor.id !== user.id) {
      alert("You don't have permission to delete this course.");
      return;
    } else {
      if (course.published) {
        alert("Once course is published, you cannot delete it.");
        return;
      }
      const confirm = window.confirm("Delete Course?");

      if (confirm) {
        course.lessons?.map(async (lesson) => {
          const res = await fetch(`${baseUrl}/lessons/${lesson.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          await res.json();
        });

        const courseResponse = await fetch(`${baseUrl}/courses/${course.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await courseResponse.json();
        if (courseResponse.ok) {
          router.replace("/course/teach");
        }
      }
    }
  };

  return course ? (
    <div className="max-w-4xl mx-auto mt-20">
      <RenderCourse
        course={thecourse}
        deleteCourse={deleteCourse}
        user={user}
      />
      <hr />
      <NewLesson
        course={thecourse}
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
      {thecourse.lessons?.map((lesson, i) => (
        <Lesson
          key={lesson.id}
          lesson={lesson}
          lessonIndex={lessonIndex}
          setLessonIndex={setLessonIndex}
          i={i}
          deleteLesson={deleteLesson}
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

  // if (!parsedUser.educator) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

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
