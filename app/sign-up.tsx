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

    const handleSignUp = async () => {
        setErrorMsg(""); // reset error message to be empty each button press
        if (!name && !email && !password) { // fields cannot be empty
            setErrorMsg("Sign up failed. Please enter valid values in fields.");

        } else if (!name || !email || !password) { // if ANY field is empty

            setErrorMsg("Missing field")
            
        } else {
            // attempting to put user into our user table. no else-if block checking if user exists already because 
            // handled in backend through email check
            try {
                const response = await fetch("https://cst438-p2-backend-4b767ba8e13e.herokuapp.com/api/users", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json', // Indicate that the body content is JSON
                        'Accept': 'application/json', // Indicate that the client accepts JSON responses
                      },
                      body: JSON.stringify({ name, email, password })
                });

                // response message checking done in try block because we get the response from doing the fetch call, so 
                // doesn't come as error message in catch block
                if (response.status === 201) {
                    Alert.alert("Account created! Please log in to continue.");
                    router.push("/auth");
                  } else if (response.status === 409) {
                    setErrorMsg("User already exists with that email.");
                  } else {
                    setErrorMsg("Sign up failed. Please try again.");
                  }

            } catch (error) {
                console.log("Error is: " + error);
                // Alert.alert("Error: " + error);
                  
            }
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
  