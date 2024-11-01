import axios from 'axios';

export const checkNoteTaskConnections = async () => {
  try {
    const token = sessionStorage.getItem("User");
    const response = await axios.get('http://localhost:3000/notes/check-connections', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Connection Check Results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking connections:', error);
    throw error;
  }
}; 