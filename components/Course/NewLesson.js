import Modal from "react-modal";
import { inputClasses } from "components/ReusableClasses";

const NewLesson = ({
  course,
  openModal,
  closeModal,
  customStyles,
  isOpen,
  values,
  error,
  handleChange,
  handleSubmit,
}) => {
  Modal.setAppElement("#__next");

  return (
    <>
      <div className="flex justify-between items-center my-4">
        <div>
          <h3 className="text-xl font-medium">Lessons</h3>
        </div>
        <div>
          <button
            className="border border-gray-800 py-1 px-4 rounded-md transition duration-300 hover:bg-gray-800 hover:text-white focus:outline-none"
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
                value={values.title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content">Content</label>
              <textarea
                name="content"
                className={inputClasses()}
                value={values.content}
                onChange={handleChange}
              />
            </div>
          </div>
          {error && (
            <div className="mb-3 text-center text-red-500">{error}</div>
          )}
          <div className="text-center mb-3">
            <button
              className="border border-gray-800 py-1 px-4 rounded-md transition duration-300 hover:bg-gray-800 hover:text-white focus:outline-none"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </Modal>
      </div>
      {course.lessons.length && (
        <div className="mb-3">{course.lessons?.length} lessons</div>
      )}
    </>
  );
};

export default NewLesson;
