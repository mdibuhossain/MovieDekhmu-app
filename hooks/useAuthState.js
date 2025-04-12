import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isUserSignedIn } from "@/lib/supabaseService";
import { setLoggedIn, setLoading, setUser } from "@/redux/slices/authSlice";

const useAuthState = () => {
  const dispatch = useDispatch();
  const { trigger } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const session = await isUserSignedIn();
        if (session) {
          const { user } = session;
          const userData = {
            uid: user?.id,
            email: user?.email,
            ...user?.user_metadata,
          };
          dispatch(setUser(userData));
          dispatch(setLoggedIn(true));
        } else {
          dispatch(setUser(null));
          dispatch(setLoggedIn(false));
        }
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching current user:", error);
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [trigger]);
};

export default useAuthState;
