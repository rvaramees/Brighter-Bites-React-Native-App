import { useContext } from "react";
import AuthContext  from "../context/AuthContext"; // Adjust the path as needed

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    // This error is thrown if a component using this hook is not
    // a descendant of the AuthProvider component.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};