
import axios from 'axios';

//function for grabbing exercises
export const getExercises = async (params = {}) => {
    const options = {
        method: 'GET',
        url: 'https://cst438-p2-backend-4b767ba8e13e.herokuapp.com/exercises',
        // params: { ...params },
        // headers: {
        //     'x-rapidapi-key': '54ec59fd7amsh724c1940bbcd393p111f66jsnd567f0225d39',
        //     'x-rapidapi-host': 'exercises-by-api-ninjas.p.rapidapi.com'
        // }
    };

    try {
        const response = await axios.request(options);
        console.log('Exercises fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


//function for grabbing exercise details
export const getExerciseDetail = async (params: { name: string }) => {
    console.log('Fetching exercise detail for:', params.name);
    
    try {
        // Fetch all exercises
        const allExercises = await getExercises();
        
        // Find the specific exercise by name (case-insensitive)
        const exercise = allExercises.find(
            (ex: any) => ex.name.toLowerCase() === params.name.toLowerCase()
        );
        
        if (exercise) {
            console.log('Exercise detail found:', exercise);
            return exercise;
        } else {
            console.error('Exercise not found:', params.name);
            throw new Error(`Exercise "${params.name}" not found`);
        }
    } catch (error) {
        console.error('Error fetching exercise detail:', error);
        throw error;
    }
};


