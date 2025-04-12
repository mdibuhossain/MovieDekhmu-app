import { createClient } from "@supabase/supabase-js";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";
import { mvList } from "@/utils/dataa";

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
    ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
  } catch (error) {
    console.log("Error logging out:", error.message);
    alert(error.message);
  }
};

export const addMovie = async (payload) => {
  try {
    const { data, error } = await supabase
      .from("movies")
      .insert([payload])
      .select();
    if (error) throw error;
    ToastAndroid.show("Movie added successfully", ToastAndroid.SHORT);
    return data?.[0];
  } catch (error) {
    console.log("Error adding movie:", error.message);
    alert(error.message);
    return null;
  }
};

export const addManyMovies = async (email) => {
  try {
    const mvListWithUser = mvList.map((movie) => ({
      ...movie,
      user: email,
    }));
    const { data, error } = await supabase
      .from("movies")
      .insert(mvListWithUser)
      .select();
    if (error) throw error;
    ToastAndroid.show("Movies added successfully", ToastAndroid.SHORT);
    return data;
  } catch (error) {
    console.log("Error adding movies:", error.message);
    alert(error.message);
    return null;
  }
};

export const getMovies = async (filters = {}, email, page = 1, limit = 100) => {
  try {
    let query = supabase.from("movies").select();

    // Apply filters
    query = query.eq("user", email);
    if (filters.origin) query = query.eq("origin", filters.origin);
    if (filters.year) query = query.eq("year", filters.year);
    if (filters.filmType) query = query.eq("filmType", filters.filmType);
    if (filters.subType) query = query.eq("subType", filters.subType);
    if (filters.review) query = query.eq("review", filters.review);
    if (filters.title) query = query.ilike("title", `%${filters.title}%`);

    // Add pagination
    query = query.range((page - 1) * limit, page * limit - 1);

    query = query.order("title", { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.log("Error fetching movies:", error.message);
    alert(error.message);
    return [];
  }
};

export const updateMovie = async (payload, id, email) => {
  try {
    const { data, error } = await supabase
      .from("movies")
      .update(payload)
      .eq("id", id)
      .eq("user", email)
      .select();
    if (error) throw error;
    ToastAndroid.show("Movie updated successfully", ToastAndroid.SHORT);
    return data?.[0];
  } catch (error) {
    console.log("Error updating movie:", error.message);
    alert(error.message);
    return null;
  }
};

export const deleteMovie = async (id, email) => {
  try {
    const { error } = await supabase
      .from("movies")
      .delete()
      .eq("id", id)
      .eq("user", email);
    if (error) throw error;
    ToastAndroid.show("Movie deleted successfully", ToastAndroid.SHORT);
  } catch (error) {
    console.log("Error deleting movie:", error.message);
    alert(error.message);
  }
};

export const deleteAllMovies = async (email) => {
  try {
    const { error } = await supabase.from("movies").delete().eq("user", email);
    if (error) throw error;
    ToastAndroid.show("All movies deleted successfully", ToastAndroid.SHORT);
  } catch (error) {
    console.log("Error deleting all movies:", error.message);
    alert(error.message);
  }
};

export const backupMoviesToCloud = async (email) => {
  try {
    const { data, error } = await supabase
      .from("movies")
      .select()
      .eq("user", email);

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error("No movies found for backup.");
    }

    const json = JSON.stringify(data);

    const { error: backupError } = await supabase
      .from("movie-backups")
      .upsert({ user: email, backup: json });

    if (backupError) throw backupError;

    ToastAndroid.show("Backup successful", ToastAndroid.SHORT);
  } catch (error) {
    console.log("Error backing up movies:", error.message);
    alert(error.message);
  }
};

export const restoreMoviesFromBackup = async (email) => {
  try {
    const { data, error } = await supabase
      .from("movie-backups")
      .select("backup")
      .eq("user", email);

    if (error) throw error;

    if (!data || !data?.[0]?.backup) {
      throw new Error("No backup found for restoration.");
    }
    console.log("Restoring movies:", data?.[0]?.backup);

    const movies = await JSON.parse(data?.[0]?.backup);

    const twickedMovies = movies.map((movie) => {
      const { id, ...rest } = movie;
      return { ...rest, user: email };
    });

    const { error: restoreError } = await supabase
      .from("movies")
      .insert(twickedMovies);

    if (restoreError) throw restoreError;

    ToastAndroid.show("Restore successful", ToastAndroid.SHORT);
  } catch (error) {
    console.log("Error restoring movies:", error.message);
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

    if (!session) {
      return false;
    }

    const {
      data: { user: userData },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !userData) {
      console.log("User does not exist in the database:", userError?.message);
      return false;
    }

    return session;
  } catch (error) {
    console.log("Error checking if user is signed in:", error.message);
    return false;
  }
};

// export const deleteAccount = async (userId) => {
//   try {
//     // Delete all movies associated with the user
//     // const { error: deleteMoviesError } = await supabase
//     //   .from("movies")
//     //   .delete()
//     //   .eq("user", email);

//     // if (deleteMoviesError) throw deleteMoviesError;

//     // Delete the user account
//     const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
//       userId
//     );

//     if (deleteUserError) throw deleteUserError;

//     ToastAndroid.show("Account deleted successfully", ToastAndroid.SHORT);
//   } catch (error) {
//     console.log("Error deleting account:", error.message);
//     alert("Failed to delete account. Please try again.");
//   }
// };
