const Lesson = ({ lesson, lessonIndex, setLessonIndex, i }) => {
  return (
    <div
      className="shadow-md mb-2 cursor-pointer"      
      onClick={() => setLessonIndex(i)}
    >
      <div className="flex justify-between items-center py-2 px-4 rounded-md text-lg">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center">
            {i + 1}
          </div>
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
