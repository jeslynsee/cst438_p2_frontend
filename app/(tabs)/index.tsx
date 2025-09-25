import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HelloWave } from "@/components/HelloWave";
import { useSession } from "@/hooks/ctx";
import { GoogleUser } from "@/types/user";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useProfile from "@/hooks/useProfile";
import { ProfilePic } from "@/components/ProfilePic";

// Default profile picture (Replace later with Google Profile)
const DEFAULT_PROFILE_PIC = require("@/assets/images/default-profile.png");

// Static Workout Split Data (Replace later with API data)
const workoutSplit = [
  { day: "Monday", workout: "Push Day" },
  { day: "Tuesday", workout: "Pull Day" },
  { day: "Wednesday", workout: "Leg Day" },
  { day: "Thursday", workout: "Chest/Back" },
  { day: "Friday", workout: "Shoulders/Arms" },
  { day: "Saturday", workout: "Leg Day" },
  { day: "Sunday", workout: "Rest" },
];

export default function HomeScreen() {
  const { profile } = useProfile();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [workoutData, setWorkoutData] = useState(workoutSplit);

  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        const updatedWorkoutData = await Promise.all(
          workoutSplit.map(async (item) => {
            const savedWorkout = await AsyncStorage.getItem(item.day);
            return savedWorkout ? { ...item, workout: savedWorkout } : item;
          })
        );
        setWorkoutData(updatedWorkoutData);
      } catch (error) {
        console.error("Failed to load workout data", error);
      }
    };

    loadWorkoutData();
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleDayPress = (dayItem: { day: string; workout: string }) => {
    navigation.navigate("WorkoutDay", { day: dayItem.day, workout: dayItem.workout });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.welcomeText}>
            Welcome, {profile?.user?.username ? profile?.user?.username.split(" ")[0] : "User"}
          </ThemedText>
          <HelloWave />
        </View>
        <View style={styles.headerRight}>
          <ProfilePic />
        </View>
      </View>

      {/* Subheader Section */}
      <View style={styles.subHeader}>
        <ThemedText type="subtitle">Your Current Split</ThemedText>
        <View style={styles.subHeaderDate}>
          <ThemedText type="default">{formattedDate}</ThemedText>
        </View>
      </View>

      {/* Workout Split List */}
      <FlatList
        data={workoutData}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleDayPress(item)}>
            <ThemedText type="title" style={styles.cardTitle}>
              {item.day}
            </ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>{item.workout}</ThemedText>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.cardList}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F8FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerRight: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  subHeader: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  subHeaderDate: {
    fontSize: 16,
    color: "#888",
    marginBottom: 1,
    marginTop: 1,
  },
  cardList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
});
