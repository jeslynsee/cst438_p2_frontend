import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, TextInput, View, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { RootStackParamList } from '@/types/navigation';
import { Exercise } from '@/types/exercise';
import { getExercises } from '@/api/workOutAPI';
import { addExerciseToWorkoutPlan } from '@/db/workoutPlan';

export default function AddWorkoutScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "AddWorkout">>();
  const navigation = useNavigation();
  const { day, userId, workoutPlanName } = route.params;

  // useStates for holding user inputs for exercise, reps, sets, etc.
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]); // Store all exercises
  const [loading, setLoading] = useState(true); // Start as true to show loading on mount
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const addWorkout = async () => {
    console.log("Add Workout button clicked!");
    if (!selectedExercise || !sets || !reps) {
      console.error("Please fill in all fields.");
      return;
    }

    console.log(`Attempting to add: ${selectedExercise}, Sets: ${sets}, Reps: ${reps}`);

    try {
      const success = await addExerciseToWorkoutPlan(
        userId,
        workoutPlanName,
        selectedExercise,
        day,
        parseInt(sets),
        parseInt(reps)
      );

      if (success) {
        console.log("Exercise successfully added!");
        setSelectedExercise("");
        setSets("");
        setReps("");
        alert("Workout added! Add another or go back.");
      } else {
        console.error("Failed to add exercise.");
      }
    } catch (error) {
      console.error("Error calling addExerciseToWorkoutPlan:", error);
    }
  };

  // Load all exercises once on component mount
  useEffect(() => {
    const fetchAllExercises = async () => {
      setLoading(true);
      try {
        const fetchedExercises = await getExercises({});
        console.log('✅ All exercises fetched:', fetchedExercises.length, 'exercises');
        setAllExercises(fetchedExercises);
        setExercises(fetchedExercises); // Show all initially
      } catch (error) {
        console.error('❌ Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllExercises();
  }, []); // Empty dependency array = runs only once on mount

  // Filter exercises locally when search term changes (case-insensitive)
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If search is empty, show all exercises
      setExercises(allExercises);
      console.log('🔍 Search cleared, showing all', allExercises.length, 'exercises');
    } else {
      // Filter by name (case-insensitive)
      const filtered = allExercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`🔍 Filtered ${filtered.length} exercises for "${searchTerm}"`);
      setExercises(filtered);
    }
  }, [searchTerm, allExercises]);

  // shows loading message while fetching exercises
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading exercises...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ThemedText style={styles.backArrow}>←</ThemedText>
        </TouchableOpacity>

        <ThemedText type="title">Add a Workout</ThemedText>

      <ThemedText style={styles.placeholder}>Select Exercise</ThemedText>
      <TextInput
        style={styles.input}
        placeholder='Type to search exercises...'
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Exercise List Section with fixed height */}
      <View style={styles.exerciseListContainer}>
        <ThemedText style={styles.resultsCount}>
          {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} found
        </ThemedText>
        <FlatList
          data={exercises}
          keyExtractor={(item, index) => item.id?.toString() || `${item.name}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => {
                setSelectedExercise(item.name);
                console.log('✅ Selected:', item.name);
              }}
              style={styles.exerciseCard}
            >
              <ThemedText style={styles.exerciseTitle}>{item.name}</ThemedText>
              <ThemedText style={styles.exerciseDetails}>
                {item.muscle} • {item.difficulty} • {item.equipment}
              </ThemedText>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                {searchTerm ? `No exercises found for "${searchTerm}"` : 'No exercises available'}
              </ThemedText>
            </View>
          }
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>

      {/* Selected Exercise and Inputs Section */}
      <View style={styles.inputSection}>
        {selectedExercise ? (
          <ThemedText style={styles.selectedExercise}>Selected: {selectedExercise}</ThemedText>
        ) : null}
        
        <ThemedText style={styles.placeholder3}>Enter Sets and Reps Below</ThemedText>
        
        <ThemedText style={styles.placeholder2}>Sets</ThemedText>
        <TextInput
          style={styles.input}
          placeholder='Number of Sets'
          keyboardType="numeric"
          value={sets}
          onChangeText={setSets}
        />
        
        <ThemedText style={styles.placeholder2}>Reps</ThemedText>
        <TextInput
          style={styles.input}
          placeholder='Number of Reps'
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
        />
        
        <TouchableOpacity style={styles.button} onPress={addWorkout}>
          <ThemedText type="default">Add Workout</ThemedText>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 40,
    color: "#333",
  },
  placeholder: {
    marginVertical: 10,
    fontSize: 25,
    marginTop: 30,
  },
  placeholder2: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder3: {
    marginVertical: 10,
    fontSize: 16,
    fontStyle: "italic",
    color: '#666',
  },
  exerciseListContainer: {
    minHeight: 250,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  resultsCount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  inputSection: {
    flex: 1,
  },
  selectedExercise: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 20,
    fontStyle: "italic",
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontStyle: "italic",
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: "#888",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 30,
  },
});