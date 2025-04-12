import { createClient } from "@supabase/supabase-js";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: ReactNativeAsyncStorage,
  },
});

export const signUp = async (fullName, email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { displayName: fullName },
      },
    });
    if (error) throw error;
    return { loading: false, user: data?.user };
  } catch (error) {
    console.log("Error signing up:", error.message);
    alert(error.message);
  }
};

export const logIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.log("Error logging in:", error.message);
    alert(error.message);
    return null;
  }
};

export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    alert("Logged out successfully");
  } catch (error) {
    console.log("Error logging out:", error.message);
    alert(error.message);
  }
};

export const addMovie = async (payload, email) => {
  try {
    const { data, error } = await supabase.from("movies").insert([payload]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.log("Error adding movie:", error.message);
    alert(error.message);
    return null;
  }
};

export const getMovies = async (filters = {}, email) => {
  try {
    let query = supabase.from("movies").select("*");

    // Apply filters
    if (filters.origin) query = query.eq("origin", filters.origin);
    if (filters.year) query = query.eq("year", filters.year);
    if (filters.filmType) query = query.eq("filmType", filters.filmType);
    if (filters.subType) query = query.eq("subType", filters.subType);
    if (filters.review) query = query.eq("review", filters.review);
    if (filters.title) query = query.ilike("title", `%${filters.title}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.log("Error fetching movies:", error.message);
    alert(error.message);
    return [];
  }
};

export const deleteMovie = async (id, email) => {
  try {
    const { error } = await supabase.from("movies").delete().eq("id", id);
    if (error) throw error;
    alert("Movie deleted successfully");
  } catch (error) {
    console.log("Error deleting movie:", error.message);
    alert(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    // Refresh the session to ensure it is valid
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.log("Error fetching session:", sessionError.message);
      return null;
    }

    if (!session) {
      console.log("Session is missing or invalid.");
      return null;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log("Error fetching user:", error.message);
      throw error;
    }

    return user;
  } catch (error) {
    console.log("Error fetching current user:", error.message);
    alert(
      "An error occurred while fetching the current user. Please try again."
    );
    return null;
  }
};

export const isUserSignedIn = async () => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.log("Error checking session:", sessionError.message);
      return false;
    }

    return session;
  } catch (error) {
    console.log("Error checking if user is signed in:", error.message);
    return false;
  }
};
