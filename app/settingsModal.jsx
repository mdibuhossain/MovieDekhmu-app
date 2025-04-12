import { View, Text, Alert } from "react-native";
import CustomButton from "../components/CustomButton";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { clearMovies, setLoading } from "@/redux/slices/dataSlice";
import {
  deleteAllMovies,
  backupMoviesToFirebase,
  restoreMoviesFromBackup,
} from "@/lib/firebaseService";

const settingsModal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { movies, isLoading } = useSelector((state) => state.data);
  const { user } = useSelector((state) => state.auth);

  const handleBack = () => {
    router.back();
  };

  const handleClearMovies = () => {
    Alert.alert("Confirm", "Are you sure you want to clear all movies?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          dispatch(setLoading(true));
          try {
            await deleteAllMovies(user?.email);
            dispatch(clearMovies());
            dispatch(setLoading(false));
          } catch (error) {
            console.error("Error clearing movies: ", error);
          } finally {
            dispatch(setLoading(false));
          }
        },
      },
    ]);
  };

  const handleBackupToFirebase = async () => {
    dispatch(setLoading(true));
    try {
      await backupMoviesToFirebase(user?.email);
      alert("Movies backed up to Firebase successfully!");
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error backing up movies to Firebase: ", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRestoreFromBackup = async () => {
    dispatch(setLoading(false));
    try {
      await restoreMoviesFromBackup(user?.email);
      alert("Movies restored from backup successfully!");
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error restoring movies from backup: ", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDownloadBackup = async () => {
    dispatch(setLoading(true));
    try {
      const backupData = movies.map((movie) => ({ ...movie }));
      const json = JSON.stringify(backupData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `movies_backup_${new Date().toISOString()}.json`;
      link.click();

      URL.revokeObjectURL(url);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error downloading backup: ", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View className="bg-primary flex-1 items-center px-4 py-6">
      <View className="flex-row w-full items-center mb-4">
        <View
          className="flex-1 flex-row items-center justify-start"
          style={{ gap: 8 }}
        >
          <CustomButton
            containerStyle="bg-gray-700 border p-2 !h-9 !w-9 justify-center items-center"
            handlePress={handleBack}
            icon={<FontAwesome6 name="arrow-left" size={14} color="white" />}
          />
          <Text className="text-white text-xl font-mPmedium">Settings</Text>
        </View>
      </View>

      <View className="bg-black-100 w-full p-4 rounded-lg">
        <Text className="text-white text-base font-mPsemibold mb-2">
          Total Movies
        </Text>
        <Text className="text-gray-100 text-sm font-mPregular mb-4">
          {movies.length} movies in the list
        </Text>
        <CustomButton
          containerStyle="bg-red-600 p-3 rounded-md"
          handlePress={handleClearMovies}
          textStyle="text-white text-sm font-mPmedium"
          title={isLoading ? "Clearing..." : "Clear All Movies"}
        />
        <CustomButton
          containerStyle="bg-blue-600 p-3 rounded-md"
          handlePress={handleBackupToFirebase}
          textStyle="text-white text-sm font-mPmedium"
          title={isLoading ? "Backing up..." : "Backup to Firebase"}
        />
        <CustomButton
          containerStyle="bg-yellow-600 p-3 rounded-md"
          handlePress={handleRestoreFromBackup}
          textStyle="text-white text-sm font-mPmedium"
          title={isLoading ? "Restoring..." : "Restore from Backup"}
        />
        <CustomButton
          containerStyle="bg-blue-600 p-3 rounded-md"
          handlePress={handleDownloadBackup}
          textStyle="text-white text-sm font-mPmedium"
          title={isLoading ? "Downloading..." : "Download Backup"}
        />
      </View>
    </View>
  );
};

export default settingsModal;
