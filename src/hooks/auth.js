import { createContext, useState, useEffect, useContext } from "react";

// Create a Context for the Auth
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to log in the user
  const userLogin = (userProfile) => {
    localStorage.setItem("currentUser", JSON.stringify(userProfile));
    setCurrentUser(userProfile);
  };

  // Function to log out the user
  const userLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  // Load the user from local storage when the component mounts
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, userLogin, userLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
