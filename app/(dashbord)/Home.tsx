import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

interface WeatherResponse {
  name: string;
  main: { temp: number; humidity: number; feels_like: number };
  weather: Array<{ description: string; main: string }>;
  wind: { speed: number };
  visibility: number;
}

interface ForecastItem {
  dayName: string;
  temp: number;
  iconCode: string;
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentWeather, setCurrentWeather] = useState<WeatherResponse | null>(
    null,
  );
  const [forecastList, setForecastList] = useState<ForecastItem[]>([]);

  const apiKey = "02cac9d89b06a9e7967e4b58288a25b1";

  // dawasata adala name eka ganna funshion eka
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  useEffect(() => {
    const getLiveWeatherData = async () => {
      try {
        setLoading(true);

        // Location Permission  illanawa methanin
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "කාලගුණය පෙන්වීමට Location Permission ලබා දෙන්න.",
          );
          setLoading(false);
          return;
        }

        // get Current Location 
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // API 1: Current Weather Data
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const currentRes = await axios.get<WeatherResponse>(currentWeatherUrl);
        setCurrentWeather(currentRes.data);

        // API 2: 5-Day Forecast Data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        const forecastRes = await axios.get<any>(forecastUrl);

        // hama dawasakama 12.00 adala deatils  tka filter karala gannawa
        const dailyData: ForecastItem[] = [];
        forecastRes.data.list.forEach((item: any) => {
          if (item.dt_txt.includes("12:00:00")) {
            dailyData.push({
              dayName: getDayName(item.dt_txt),
              temp: Math.round(item.main.temp),
              iconCode: item.weather[0].icon,
            });
          }
        });
        setForecastList(dailyData);
      } catch (error) {
        console.log("Error fetching weather:", error);
        Alert.alert("Error", "කාලගුණ දත්ත ලබා ගැනීමට අපොහොසත් විය.");
      } finally {
        setLoading(false);
      }
    };

    getLiveWeatherData();
  }, []);

  // lode wenakama ActivityIndicator  eka penwanawa
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-900">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-2 font-semibold">
          Loading Live Weather...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-blue-900 mt-6">
      {/* Upper Section - Live Weather Header */}
      <View className="w-full bg-white p-5 rounded-b-[40px] shadow-lg">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-2xl font-black text-stone-900">
              ⛅ {currentWeather?.name || "Live Weather"}
            </Text>
            <Text className="text-xs text-stone-500 mt-1">
              Today's Forecast
            </Text>
          </View>
          <Text className="text-sm font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-full">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* Main Temperature & GIF */}
        <View className="flex-row items-center justify-between my-2 px-2">
          <View>
            <Text className="text-7xl font-black text-blue-900">
              {currentWeather
                ? `${Math.round(currentWeather.main.temp)}°C`
                : "--°C"}
            </Text>
            <Text className="text-stone-600 capitalize font-medium mt-1">
              {currentWeather?.weather[0].description || "Clear Sky"}
            </Text>
          </View>
          <Image
            source={require("../../assets/images/cloudLive.gif")}
            className="w-28 h-28"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Middle Section - 5 Day Forecast (Horizontal Scroll) */}
      <View className="mt-6 px-5">
        <Text className="text-white text-lg font-bold mb-3">
          📅 5-Day Forecast
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={forecastList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="bg-white/10 border border-white/20 w-20 py-4 rounded-2xl items-center mr-3">
              <Text className="text-white/80 text-sm font-bold">
                {item.dayName}
              </Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.iconCode}@2x.png`,
                }}
                className="w-12 h-12 my-1"
              />
              <Text className="text-white text-base font-black">
                {item.temp}°C
              </Text>
            </View>
          )}
        />
      </View>

      {/* Lower Section - Weather Details Grid */}
      <View className="mt-6 px-5 mb-10">
        <Text className="text-white text-lg font-bold mb-3">
          📊 Weather Details
        </Text>

        <View className="w-full bg-white rounded-3xl p-6 shadow-md">
          {/* Row 1 */}
          <View className="flex-row justify-between mb-6">
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">🌡️</Text>
              <View>
                <Text className="text-stone-400 text-xs font-bold uppercase">
                  Feels Like
                </Text>
                <Text className="text-stone-800 text-base font-black">
                  {currentWeather
                    ? `${Math.round(currentWeather.main.feels_like)} °C`
                    : "--"}
                </Text>
              </View>
            </View>

            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">💧</Text>
              <View>
                <Text className="text-stone-400 text-xs font-bold uppercase">
                  Humidity
                </Text>
                <Text className="text-stone-800 text-base font-black">
                  {currentWeather ? `${currentWeather.main.humidity}%` : "--"}
                </Text>
              </View>
            </View>
          </View>

          {/* Row 2 */}
          <View className="flex-row justify-between mb-6">
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">💨</Text>
              <View>
                <Text className="text-stone-400 text-xs font-bold uppercase">
                  Wind Speed
                </Text>
                <Text className="text-stone-800 text-base font-black">
                  {currentWeather ? `${currentWeather.wind.speed} m/s` : "--"}
                </Text>
              </View>
            </View>

            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">👁️</Text>
              <View>
                <Text className="text-stone-400 text-xs font-bold uppercase">
                  Visibility
                </Text>
                <Text className="text-stone-800 text-base font-black">
                  {currentWeather
                    ? `${(currentWeather.visibility / 1000).toFixed(1)} km`
                    : "--"}
                </Text>
              </View>
            </View>
          </View>

          {/* Row 3 - UV index (OpenWeather basic API එකෙන් UV එන්නේ නැති නිසා Static හෝ Default අගයක් දැම්මා) */}
          <View className="flex-row justify-between">
            <View className="w-[45%] flex-row items-center">
              <Text className="text-2xl mr-3">☀️</Text>
              <View>
                <Text className="text-stone-400 text-xs font-bold uppercase">
                  UV Index
                </Text>
                <Text className="text-stone-800 text-base font-black">
                  Normal
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
