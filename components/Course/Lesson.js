import TrashSvg from "components/Svg/TrashSvg";
import { useState } from "react";

const Lesson = ({ lesson, lessonIndex, setLessonIndex, i, deleteLesson }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className="shadow-md mb-2 cursor-pointer"
      onClick={() => setLessonIndex(i)}
    >
      <div
        className="flex justify-between items-center py-2 px-4 rounded-md text-lg"
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
      >
        <div className="flex items-center space-x-4">
          {!isHover ? (
            <div
              className={`w-10 h-10 rounded-full flex justify-center items-center bg-gray-300`}
            >
              {i + 1}
            </div>
          ) : (
            <TrashSvg
              onClick={() => deleteLesson(lesson.id)}
              width="w-10"
              height="w-10"
            />
          )}
          <h3 className="">{lesson.title}</h3>
        </div>
        <button className="focus:outline-none">
          {lessonIndex === i ? "-" : "+"}
        </button>
      </div>
      {lessonIndex === i && (
        <div className="py-2 px-4 transition duration-300">
          {lesson.content}
        </div>
      )}
    </div>
  );
};

export default Lesson;
