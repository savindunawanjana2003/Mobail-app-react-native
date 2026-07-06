import { useAuth } from "@/hooks/useAuth"; 
import { useLoader } from "@/hooks/useLoader";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getSavedLocations,
  removeLocation,
  saveLocation,
} from "../../service/weatherService";

export default function LocationsScreen() {
  const [cityInput, setCityInput] = useState("");
  const [savedCities, setSavedCities] = useState<any[]>([]);

  const { user } = useAuth(); 
  const { showLoader, hideLoader } = useLoader(); 

  useEffect(() => {
    if (user?.uid) {
      loadLocations();
    }
  }, [user]);

  const loadLocations = async () => {
    if (!user?.uid) return;
    showLoader();
    const data = await getSavedLocations(user.uid);
    setSavedCities(data);
    hideLoader();
  };

  const handleAddLocation = async () => {
    if (!cityInput.trim()) {
      Alert.alert("වැරදියි", "කරුණාකර නගරයක නමක් ඇතුළත් කරන්න.");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Error", "යූසර් හඳුනාගන්න බැහැ. කරුණාකර නැවත ලොග් වෙන්න.");
      return;
    }

    showLoader();
    const result = await saveLocation(cityInput.trim(), user.uid);
    hideLoader();

    if (result.success) {
      Alert.alert("සාර්ථකයි", `${cityInput} එකතු කරගත්තා!`);
      setCityInput("");
      loadLocations(); 
    } else {
      Alert.alert("අසාර්ථකයි", "සේව් කරන්න බැරි වුනා.");
    }
  };

  const handleDelete = async (id: string) => {
    showLoader();
    const result = await removeLocation(id);
    hideLoader();
    if (result.success) {
      loadLocations();
    }
  };

  return (
    <View className="flex-1 bg-stone-100 p-5 mt-10">
      <Text className="text-2xl font-bold text-blue-900 mb-4">
        Saved Locations
      </Text>

      {/* Input section */}
      <View className="flex-row mb-5">
        <TextInput
          className="flex-1 bg-white p-3 rounded-lg border border-stone-300 mr-2"
          placeholder="Enter city name (e.g. Kandy)"
          value={cityInput}
          onChangeText={setCityInput}
        />
        <TouchableOpacity
          className="bg-blue-800 p-3 rounded-lg justify-center"
          onPress={handleAddLocation}
        >
          <Text className="text-white font-bold">Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={savedCities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl mb-3 flex-row justify-between items-center shadow-sm">
            <Text className="text-lg font-semibold text-stone-800">
              {item.cityName}
            </Text>

            <TouchableOpacity
              className="bg-red-500 p-2 rounded-lg"
              onPress={() => handleDelete(item.id)}
            >
              <Text className="text-white text-xs">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-stone-500 mt-5">
            No locations saved yet.
          </Text>
        }
      />
    </View>
  );
}
