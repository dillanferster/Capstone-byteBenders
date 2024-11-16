export const validateNote = (note) => {
  const errors = {};

  // Title validation
  if (!note.title) {
    errors.title = 'Title is required';
  } else if (note.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (note.title.length > 50) {
    errors.title = 'Title must be less than 50 characters';
  }

  // Content validation
  if (!note.content) {
    errors.content = 'Content is required';
  } else if (note.content.length < 10) {
    errors.content = 'Content must be at least 10 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 