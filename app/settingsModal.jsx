import { View, Text, Alert, ToastAndroid } from "react-native";
import CustomButton from "../components/CustomButton";
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { clearMovies, setLoading } from "@/redux/slices/dataSlice";
import {
  getMoviesCount,
  deleteAllMovies,
  backupMoviesToCloud,
  restoreMoviesFromBackup,
} from "@/lib/supabaseService";
import { useEffect, useState } from "react";

const settingsModal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [moviesCount, setMoviesCount] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.data);

  useEffect(() => {
    getMoviesCount(user?.email)
      .then((count) => {
        setMoviesCount(count);
      })
      .catch((error) => {
        console.error("Error fetching movies count: ", error);
      });
  }, [isLoading]);

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
            dispatch(setLoading(false));
          }
        },
      },
    ]);
  };

  const handleBackupToCloud = async () => {
    dispatch(setLoading(true));
    try {
      await backupMoviesToCloud(user?.email);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error backing up movies to Firebase: ", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRestoreFromBackup = async () => {
    dispatch(setLoading(true));
    try {
      await restoreMoviesFromBackup(user?.email);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error restoring movies from backup: ", error);
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
  // bg-primary flex-1 items-center px-2
  return (
    <View className="bg-primary flex-1 items-center px-4 py-6">
      <View className="flex-row w-full items-center mb-4">
        <View
          className="flex-1 flex-row items-center justify-start"
          style={{ gap: 8 }}
        >
          <CustomButton
            containerStyle="bg-gray-800 border border-gray-700 p-2 justify-center items-center"
            handlePress={handleBack}
            icon={<FontAwesome6 name="arrow-left" size={16} color="white" />}
          />
          <Text className="text-white text-2xl font-bold tracking-wide">
            Settings
          </Text>
        </View>
      </View>

      <View className="bg-gray-800 w-full p-6 rounded-xl shadow-lg">
        <Text className="text-white text-lg font-semibold mb-3">
          Total Movies
        </Text>
        <Text className="text-gray-400 text-sm font-light mb-6">
          {moviesCount} movies in the list
        </Text>
        <CustomButton
          containerStyle="bg-red-500 p-4 rounded-lg shadow-md hover:bg-red-600"
          handlePress={handleClearMovies}
          textStyle="text-white text-base font-medium"
          icon={<MaterialIcons name="delete" size={24} color="white" />}
          title={isLoading ? "Clearing..." : "Clear All Movies"}
        />
        <CustomButton
          containerStyle="bg-blue-500 p-4 rounded-lg shadow-md hover:bg-blue-600 mt-5"
          handlePress={handleBackupToCloud}
          textStyle="text-white text-base font-medium"
          icon={<MaterialIcons name="backup" size={24} color="white" />}
          title={isLoading ? "Backing up..." : "Backup to Cloud"}
        />
        <CustomButton
          containerStyle="bg-yellow-500 p-4 rounded-lg shadow-md hover:bg-yellow-600 mt-5"
          handlePress={handleRestoreFromBackup}
          textStyle="text-white text-base font-medium"
          icon={<MaterialCommunityIcons name="backup-restore" size={24} color="white" />}
          title={isLoading ? "Restoring..." : "Restore from Cloud"}
        />
        {/* <CustomButton
          containerStyle="bg-blue-500 p-4 rounded-lg shadow-md hover:bg-blue-600 mt-5"
          handlePress={handleDownloadBackup}
          textStyle="text-white text-base font-medium"
          title={isLoading ? "Downloading..." : "Download Backup"}
        /> */}
      </View>
    </View>
  );
};

export default settingsModal;
