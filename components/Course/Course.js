import Image from "next/image";
import Link from "next/link";
import TrashSvg from "components/Svg/TrashSvg";

const Course = ({ course, deleteCourse, user }) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-xl font-medium">{course.title}</h3>
          <p className="mb-2">By {course.instructor.username}</p>
          <small className="bg-gray-300 text-gray-700 p-2 rounded-md">
            {course.category.title}
          </small>
        </div>
        <div className="flex md:justify-between items-center space-x-2 mt-4 sm:mt-0">
          <Link href={`/course/edit/${course.slug}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800 cursor-pointer"
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
          </Link>
          <button className="border border-gray-800 py-1 px-4 rounded-md transition duration-300 hover:bg-gray-800 hover:text-white focus:outline-none">
            Publish
          </button>
          <TrashSvg onClick={() => deleteCourse(course)} />
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
    </>
  );
};

export default Course;
