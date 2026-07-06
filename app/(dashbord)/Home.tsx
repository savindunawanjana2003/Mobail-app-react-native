import { db } from "@/service/firebase";
import axios from "axios";
import * as Location from "expo-location";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";

interface WeatherResponse {
  // list: any;
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: Array<{ description: string }>;
  wind: { speed: number };
}

interface dayDeatiles {
  temprecher: string;
  huminity: string;
  windSpeed: string;
}

interface forecastResponse {
  day: string;
  wetherDeatiles: dayDeatiles[];
}

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [forCastDeatileseachDay, setforCastDeatileseachDay] =
    useState<forecastResponse>();

  const [curentLocetionWetherData, setcurentLocetionWetherData] =
    useState<WeatherResponse | null>(null);

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };
  // ===================
  useEffect(() => {
    const apiKey = "02cac9d89b06a9e7967e4b58288a25b1"; // give  OpenWeatherMap API Key hear

    const getCurrentLocationWeather = async () => {
      setLoading(true);

      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "කරුණාකර කාලගුණය පෙන්වීමට Location Permission ලබා දෙන්න.",
          );
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const response = await axios.get<WeatherResponse>(url);
        setcurentLocetionWetherData(response.data);

        const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        try {
          const response = await axios.get<any>(url2);

          const list = response.data.list;
          list.map((day: any) => {
            console.log(
              "===============================77777777777777777777777777777777777====",
            );

            console.log(day.main.feels_like);
            // getDayName();

            const deatilsObject: forecastResponse = {
              day: "",
              wetherDeatiles: [
                {
                  temprecher: "",
                  huminity: "",
                  windSpeed: "",
                },
              ],
            };

            setforCastDeatileseachDay(deatilsObject);

            console.log(
              "============================77777777777777777777777777777777777====",
            );
          });

          console.log(response.data.list);
        } catch (error) {
          console.log("Forecast error:", error);
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "ඔබගේ වත්මන් ස්ථානයේ කාලගුණය ලබා ගැනීමට අපොහොසත් විය.",
        );
      } finally {
        setLoading(false);
      }
    };

    // const getForecast = async () => {
    // /data/2.5/forecast
    // const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${curentLocetionWetherData?.name}&lon=${curentLocetionWetherData?.name}&appid=${apiKey}&units=metric`;
    // try {
    //   const response = await axios.get<WeatherResponse>(url);
    // } catch (error) {
    //   console.log("Forecast error:", error);
    // }
    // };
    // getForecast();

    getCurrentLocationWeather();
  }, []);

  // ========================

  // useEffect(() => {
  //   const getForecast = async () => {
  //     // /data/2.5/forecast
  //     const apiKey = "02cac9d89b06a9e7967e4b58288a25b1"; // give  OpenWeatherMap API Key hear
  //     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${curentLocetionWetherData?.name}&lon=${curentLocetionWetherData?.name}&appid=${apiKey}&units=metric`;
  //     try {
  //       const response = await axios.get<WeatherResponse>(url);
  //     } catch (error) {
  //       console.log("Forecast error:", error);
  //     }
  //   };
  //   getForecast();
  // }, []);

  // ========================

  const fetchWeather = async (): Promise<void> => {
    if (!city.trim()) {
      Alert.alert("Error", "කරුණාකර නගරයක නමක් ඇතුළත් කරන්න!");
      return;
    }

    setLoading(true);
    const apiKey = "02cac9d89b06a9e7967e4b58288a25b1"; // give  OpenWeatherMap API Key hear
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get<WeatherResponse>(url);
      setWeatherData(response.data);
    } catch (error) {
      Alert.alert("Error", "නගරය සොයාගත නොහැකි විය! නැවත උත්සාහ කරන්න.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (): Promise<void> => {
    if (!weatherData) return;

    try {
      await addDoc(collection(db, "favorite_cities"), {
        cityName: weatherData.name,
        savedAt: new Date(),
      });
      Alert.alert("Success", `${weatherData.name} සුරැකි නගර අතරට එකතු කළා!`);
    } catch (e) {
      Alert.alert("Error", "Firebase එකට දාන්න බැරි වුණා.");
    }
  };

  return (
    <View className="flex-1 bg-red-700">
      <View className="w-[100%] h-[35%] bg-white">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-2xl mt-4 ml-4 mb-6 font-extraboldtext-stone-900  tracking-wider">
            ⛅ Live Weather
          </Text>
          <Text className="text-sm mt-4 ml-4 mb-6 text-stone-900 ">
            Thursday 02:42 PM
          </Text>
        </View>

        {/* Main Weather Display */}
        <View className="w-[100%] h-[70%] flex-row mt-2">
          {/* Left - Temperature & Details */}
          <View className="w-[50%] h-[100%] items-center justify-center">
            {" "}
            {/* {Math.round(weatherData.main.temp)}°C */}
            <Text className="text-7xl font-black text-blue-800">
              {curentLocetionWetherData
                ? `${Math.round(curentLocetionWetherData.main.temp)}°C`
                : "--°C"}
            </Text>
            <View className="mt-2">
              <Text className="text-stone-900 text-sm">Real feel 16°C</Text>
              <Text className="text-stone-900  text-sm">
                💨 Wind 6-8 km/h
                {curentLocetionWetherData
                  ? `${curentLocetionWetherData.wind.speed}`
                  : "0"}
              </Text>
              <Text className="text-stone-900  text-sm">
                💧Humidity
                {curentLocetionWetherData
                  ? `${curentLocetionWetherData.main.humidity}`
                  : "0"}
              </Text>
            </View>
          </View>

          {/* Right - Weather Icon */}
          <View className="w-[50%] h-[100%] items-center justify-center">
            <Image
              source={require("../../assets/image/cloudLive.gif")}
              className="w-28 h-28"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      {/* =========================================== */}
      <View className="flex-1 bg-orange-400 items-center pt-20 px-6">
        {/* Weather Details Grid Card */}
        <View className="w-full bg-[#f8f9fe] rounded-3xl p-6 shadow-sm border border-slate-100/50 mt-4">
          {/* Row 1 */}
          <View className="flex-row justify-between mb-6">
            {/* Feels Like */}
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">🌡️</Text>
              {/* ඔයාගේ Icon එක මෙතනට දාන්න */}
              <View>
                <Text className="text-[#64748b] text-sm font-medium">
                  Feels Like
                </Text>
                <Text className="text-[#334155] text-base font-bold mt-0.5">
                  26 °C
                </Text>
              </View>
            </View>

            {/* Humidity */}
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">💧</Text>{" "}
              {/* ඔයාගේ Icon එක මෙතනට දාන්න */}
              <View>
                <Text className="text-[#64748b] text-sm font-medium">
                  Humidity
                </Text>
                <Text className="text-[#334155] text-base font-bold mt-0.5">
                  68%
                </Text>
              </View>
            </View>
          </View>

          {/* Row 2 */}
          <View className="flex-row justify-between mb-6">
            {/* Rain Chance */}
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">🌧️</Text>{" "}
              {/* ඔයාගේ Icon එක මෙතනට දාන්න */}
              <View>
                <Text className="text-[#64748b] text-sm font-medium">
                  Rain Chance
                </Text>
                <Text className="text-[#334155] text-base font-bold mt-0.5">
                  20%
                </Text>
              </View>
            </View>

            {/* Wind Speed */}
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">💨</Text>{" "}
              {/* ඔයාගේ Icon එක මෙතනට දාන්න */}
              <View>
                <Text className="text-[#64748b] text-sm font-medium">
                  Wind Speed
                </Text>
                <Text className="text-[#334155] text-base font-bold mt-0.5">
                  11 km/h
                </Text>
              </View>
            </View>
          </View>

          {/* Row 3 */}
          <View className="flex-row justify-between">
            {/* Visibility */}
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">👁️</Text>{" "}
              {/* ඔයාගේ Icon එක මෙතනට දාන්න */}
              <View>
                <Text className="text-[#64748b] text-sm font-medium">
                  Visibility
                </Text>
                <Text className="text-[#334155] text-base font-bold mt-0.5">
                  6.8 km
                </Text>
              </View>
            </View>

            {/* UV Index */}
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">☀️</Text>{" "}
              {/* ඔයාගේ Icon එක මෙතනට දාන්න */}
              <View>
                <Text className="text-[#64748b] text-sm font-medium">
                  UV Index
                </Text>
                <Text className="text-[#334155] text-base font-bold mt-0.5">
                  3
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* ==================== */}
    </View>
  );
}
