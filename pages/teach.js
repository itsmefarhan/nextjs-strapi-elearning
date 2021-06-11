import Link from "next/link";
import Image from "next/image";
import { parseCookies } from "nookies";
import { gql } from "@apollo/client";
import client from "apollo-client";

const Teach = ({ courses }) => {
  return (
    <div className="mt-20 py-3 px-10 max-w-lg mx-auto shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h3>Your Courses</h3>
        </div>
        <div className="border border-yellow-500 hover:bg-yellow-500 hover:text-white transition duration-300 py-1 px-4 rounded-md">
          <Link href="/newcourse">New Course</Link>
        </div>
      </div>

      {courses?.map((course) => (
        <div
          key={course.id}
          className="grid grid-cols-3 gap-3 my-4 shadow-md cursor-pointer"
        >
          <Link href={`/${course.slug}`}>
            <Image
              src={course.image.url}
              layout="responsive"
              width={100}
              height={100}
            />
          </Link>
          <Link href={`/${course.slug}`}>
            <div className="col-span-2 py-2">
              <h3 className="text-xl font-medium">{course.title}</h3>
              <p>{course.description.slice(0, 50)}...</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Teach;

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
        courses(where: { instructor: "${parsedUser.id}" }) {
          id
          slug
          title
          description
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
    props: { courses: data.courses },
  };
};
