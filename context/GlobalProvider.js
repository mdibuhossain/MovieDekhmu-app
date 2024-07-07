import { useContext, createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/firebaseService";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      getCurrentUser()
        .then((user) => {
          if (user) {
            setUser(user);
            setIsLoggedIn(true);
          }
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ isLoading, user, isLoggedIn, error }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
