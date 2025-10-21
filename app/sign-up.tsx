//@ts-nocheck for removing ts related errors
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, TouchableOpacity, View, Text, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";
import FlexZoneHeader from "@/components/FlexZoneHeader";

export default function SignUp() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignUp = () => {
        setErrorMsg("");
        // Alert.alert("Sign up in progress!");
        if (!name && !email && !password) {
            setErrorMsg("Sign up failed. Please enter valid values in fields.");
        } else if (!name || !email || !password) {
            setErrorMsg("Missing field")
        } else {
            // call to our backend to populate user table with this new user and redirect user to login page
        }

    }


    return (
        <View style={styles.container}>
        <Text style={{fontSize: 30, color: "green"}}>Sign Up</Text>
 {/* Text input forms below collect user's name, email, and password to send into our user table */}
        <View style={{gap: 12}}>
            {/* start of rows */}
            <View style ={styles.row}>
                <Text>Name:</Text>
                <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                />
            </View>

            <View style ={styles.row}>
                <Text>Email:</Text>
                <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                />
            </View>

            <View style ={styles.row}>
                <Text>Password:</Text>
                <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                />
            </View>

            </View>
             {/* end of rows */}

            <Button style={styles.signUpButton} onPress={handleSignUp} title="Sign Up"/>
    
            <Text style={{color: "red"}}>{errorMsg}</Text>

        </View>

    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 10, 
    },
    row: {
      flexDirection: "row",
      alignItems: "center", 
      marginVertical: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 5,
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginLeft: 10, 
      width: 180,
      height: 40, 
    }
  });
  