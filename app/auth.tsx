//@ts-nocheck for removing ts related errors
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";


import FlexZoneHeader from "@/components/FlexZoneHeader";

export default function AuthScreen() {
  const { signIn } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      if (!name && !email) {
        setError("Enter a name or email");
        return;
      }
      await signIn(username.trim(), email.trim() || undefined);
      router.replace("/");
    } catch (e) {
      setError("Failed to sign in");
      console.error(e);
    }
  };

  const switchToSignUp = () => {
    router.push("/sign-up");
  }

  return (
    <ThemedView style={styles.container}>
      <FlexZoneHeader />
      <ThemedView>
        <View style={{ gap: 12, width: 260 }}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
          />
          <TextInput
            placeholder="Email (optional)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
          />
          {error && <ThemedText style={{ color: 'red' }}>{error}</ThemedText>}
          <Button
            title="Sign In"
            onPress={handleSignIn}
          />
        </View>
      </ThemedView>
      <ThemedView>
        <ThemedText type="default">Don't have an account?</ThemedText>
        <TouchableOpacity onPress={switchToSignUp}>
          <Text style={{color: "blue"}}>Sign up here</Text>
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
});
