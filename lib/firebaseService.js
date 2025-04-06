import { app } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import {
  signOut,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { query, where } from "firebase/firestore";
import { mvList } from "@/utils/dataa";

export let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  alert(error.message);
  console.error(error.message);
}

const db = getFirestore(app);
const storage = getStorage(app);
const usersCollection = collection(db, "users");

export const signUp = async (fullName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await updateUserData({ displayName: fullName });
    const payload = {
      photoURL: "",
      uid: user?.uid,
      displayName: fullName,
      password: password,
      email: user?.email,
      emailVerified: user?.emailVerified,
    };
    addDoc(usersCollection, payload)
      .then((docRef) => {})
      .catch((error) => {
        alert(error.message);
        console.error("Error adding document: ", error);
      });
    return {
      loading: false,
      data: user,
    };
  } catch (error) {
    alert(error.message);
    console.error("Error in outter: ", error.message);
  }
};

export const logIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return userCredential.user;
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

export const logOut = async () => {
  return signOut(auth)
    .then(() => {
      router.replace("/sign-in");
    })
    .catch((error) => {
      alert(error.message);
    });
};

export const verifyEmail = async () => {
  if (!auth.currentUser)
    return alert("You must be logged in to verify your email.");
  return sendEmailVerification(auth.currentUser).then(() => {
    alert("Email verification sent! \nCheck your inbox.");
  });
};

export const updateUserData = async (payload) => {
  return updateProfile(auth.currentUser, payload)
    .then(() => {
      return payload;
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

export const uploadProfilePicture = async ({ mimeType, uri }) => {
  const storangeRef = ref(
    storage,
    `avatars/${auth.currentUser.uid}.${mimeType.split("/")[1]}`
  );

  const response = await fetch(uri);
  const imgBlob = await response.blob();
  const metadata = {
    contentType: mimeType,
    customMetadata: {
      uploadedBy: auth.currentUser.email,
      description: "Profile picture",
    },
  };

  return uploadBytes(storangeRef, imgBlob, metadata)
    .then(async (snapshot) => {
      return await getDownloadURL(snapshot.ref);
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

export const addMovie = async (payload, email) => {
  return addDoc(collection(db, `movies-${email}`), payload)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef);
      return docRef;
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

export const createDuplicateMovie = async (payload, email) => {
  const { id, ...rest } = payload;
  return addMovie(rest, email)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      return { id: docRef.id, ...rest };
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

export const updateMovie = async (payload, email) => {
  const movieRef = doc(db, `movies-${email}`, payload.id);
  return updateDoc(movieRef, payload)
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

export const deleteMovie = async (id, email) => {
  const movieRef = doc(db, `movies-${email}`, id);
  return deleteDoc(movieRef)
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      alert(error.message);
      return null;
    });
};

export const getMovies = async (filters = {}, email) => {
  const movies = [];
  let moviesQuery = collection(db, `movies-${email}`);

  // Apply filters if provided
  if (filters?.origin) {
    moviesQuery = query(moviesQuery, where("origin", "==", filters?.origin));
  }
  if (filters?.year) {
    moviesQuery = query(moviesQuery, where("year", "==", filters?.year));
  }
  if (filters?.filmType) {
    moviesQuery = query(
      moviesQuery,
      where("filmType", "==", filters?.filmType)
    );
  }
  if (filters?.subType) {
    moviesQuery = query(moviesQuery, where("subType", "==", filters?.subType));
  }
  if (filters?.review) {
    moviesQuery = query(moviesQuery, where("review", "==", filters?.review));
  }

  // Partial match for title
  if (filters?.title) {
    const querySnapshot = await getDocs(moviesQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.title &&
        data.title.toLowerCase().includes(filters?.title.toLowerCase())
      ) {
        movies.push({ id: doc.id, ...data });
      }
    });
    return movies;
  }

  const querySnapshot = await getDocs(moviesQuery);
  querySnapshot.forEach((doc) => {
    movies.push({ id: doc.id, ...doc.data() });
  });
  return movies;
};

export const addManyMovies = async (email) => {
  const batch = new writeBatch(db);

  mvList.forEach((movie) => {
    const movieRef = doc(collection(db, `movies-${email}`));
    batch.set(movieRef, movie);
  });

  batch
    .commit()
    .then(() => {
      console.log("Batch write succeeded.");
    })
    .catch((error) => {
      console.error("Batch write failed: ", error);
    });
};
