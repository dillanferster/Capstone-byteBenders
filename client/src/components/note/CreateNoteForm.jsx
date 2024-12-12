import React, { useState, useEffect } from "react";
// import { validateNote } from '../../utils/noteValidation';
import { getTasks } from "../../api";
// reference: https://www.youtube.com/watch?v=571sn_pS4kY
// reference: https://www.youtube.com/watch?v=571sn_pS4kYhttps://blog.danylkecha.com/react-notes-app?x-host=blog.danylkecha.com
// reference: Chatgpt

const CreateNoteForm = ({ onClose, onSubmit, isTaskNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [taskId, setTaskId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ title: false, content: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isTaskNote) {
      const fetchTasks = async () => {
        try {
          const fetchedTasks = await getTasks();
          setTasks(fetchedTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      fetchTasks();
    }
  }, [isTaskNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const trimmedTitle = title.trim() || "New Note"; // Set default title if empty
      const trimmedContent = content.trim();

      if (!trimmedContent) {
        alert("Content is required.");
        setIsSubmitting(false);
        return;
      }

      if (isTaskNote && !taskId) {
        alert("Please select a task for the task note.");
        setIsSubmitting(false);
        return;
      }

      const noteData = {
        title: trimmedTitle,
        content: trimmedContent,
        taskId: isTaskNote ? taskId : null,
      };

      console.log("Submitting form with data:", noteData);

      await onSubmit(noteData);

      // Clear form after submission
      setTitle("");
      setContent("");
      setTaskId("");
      setErrors({});
      setTouched({ title: false, content: false });
    } catch (error) {
      console.error("Error in form submission:", error);
      alert("Failed to create note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-note-overlay" onClick={onClose}>
      <div className="create-note-form" onClick={(e) => e.stopPropagation()}>
        <h2>{isTaskNote ? "Create Task Note" : "Create Note"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title && touched.title ? "error" : ""}
              required
              disabled={isSubmitting}
            />
            {errors.title && touched.title && (
              <div className="error-message">{errors.title}</div>
            )}
          </div>

          <div className="form-group">
            <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={errors.content && touched.content ? "error" : ""}
              required
              disabled={isSubmitting}
            />
            {errors.content && touched.content && (
              <div className="error-message">{errors.content}</div>
            )}
          </div>

          {isTaskNote && (
            <div className="form-group">
              <select
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className={`task-select ${errors.taskId ? "error" : ""}`}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a Task</option>
                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.taskName}
                  </option>
                ))}
              </select>
              {errors.taskId && (
                <div className="error-message">{errors.taskId}</div>
              )}
            </div>
          )}

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting
                ? "Creating..."
                : `Create ${isTaskNote ? "Task Note" : "Note"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteForm;
