import { useEffect, useState } from "react";
import { Button, StyleSheet, TouchableOpacity} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/hooks/ctx";
import { ProfilePic } from "@/components/ProfilePic";

export default function ProfileScreen() {
//TODO: get sign out to work properly. getting render less hooks error
  const { session, signOut } = useSession();
  const [userName, setUserName] = useState("");

  // grabbing user's name to display, using useEffect, so we get info before page loads
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch("https://cst438-p2-backend-4b767ba8e13e.herokuapp.com/api/users");
        const users = await response.json();
  
        // Find the user that matches the current session’s email
        const foundUser = users.find(user => user.email === session);
        if (foundUser) {
          setUserName(foundUser.name);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
  
    fetchUserName();
  }, [session]);

  return (
    <ThemedView style={styles.container}>
      <ProfilePic style={styles.profilePic} />

      <ThemedText type="title" style={styles.username}>
        {userName}
      </ThemedText>

      <ThemedText type="subtitle" style={styles.email}>
        {session}
      </ThemedText>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <ThemedText type="default" style={styles.buttonText}>
          Sign Out
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F8FA",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: "#888",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#888",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});