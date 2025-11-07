import { UserData } from "../../config/type";


export const getUserDataFromLocalStorage = (): UserData | null => {
  const userJson = localStorage.getItem("user");

  if (!userJson) {
    return null; 
  }

  try {
    const userData = JSON.parse(userJson) as UserData;
    
    if (userData.user_id && userData.character_id && userData.user_name) {
        return userData; 
    }
    
    return null; 

  } catch (e) {
    console.error("Failed to parse user data from localStorage:", e);
    return null;
  }
};