import { useContext, createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/firebaseService";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkUser = async () => {
    try {
      setIsLoading(true);
      getCurrentUser()
        .then((user) => {
          if (user) {
            setUser(user);
            setIsLoggedIn(true);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoading, user, isLoggedIn, error, checkUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
