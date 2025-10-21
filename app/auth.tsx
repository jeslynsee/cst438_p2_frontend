//@ts-nocheck
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, TouchableOpacity, View, Text, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";
import FlexZoneHeader from "@/components/FlexZoneHeader";

export default function AuthScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userList, setUserList] = useState([]);

  const handleSignIn = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setUserList([]);
      // TODO: grab list of users and check if user trying to log in exists
      // need a fetch here to our actual API
      const response = await fetch("https://cst438-p2-backend-4b767ba8e13e.herokuapp.com/api/users", {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        }
      });

      const result = await response.json();

      console.log(result);

      setUserList(result);

      // can't check passwords because backend uses mask() to mask actual password value, so front end can't see
      const foundUser = result.find(user => user.email === email);

      //we found existing user with matching email 
      if (foundUser) {
        Alert.alert("Login successful!");
        await signIn(email); // optional: store email in session context
        router.replace("/"); // replace takes successfully logged-in user to landing page, but doesn't allow them to just go back to prev page
      } else {
        Alert.alert("Login failed. Email and/or password don't match.");
      }

    } catch (e) {
      console.error(e);
      setError("Failed to log in. Please try again.");
    }
  };

  const switchToSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <ThemedView style={styles.container}>
      <FlexZoneHeader />

      <ThemedView>
        <View style={{ gap: 12, width: 260 }}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {error && <ThemedText style={{ color: "red" }}>{error}</ThemedText>}
          <Button title="Log In" onPress={handleSignIn} />
        </View>
      </ThemedView>

      <ThemedView>
        <ThemedText type="default">Don't have an account?</ThemedText>
        <TouchableOpacity onPress={switchToSignUp}>
          <Text style={{ color: "blue" }}>Sign up here</Text>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
});
