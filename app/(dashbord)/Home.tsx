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
            //
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
    // // /data/2.5/forecast
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

      <View className="flex w-[100%] bg-gray-950"></View>

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
              <Text className="text-2xl mr-3">💧</Text>
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
              <Text className="text-2xl mr-3">🌧️</Text>
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
              <Text className="text-2xl mr-3">💨</Text>
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
              <Text className="text-2xl mr-3">👁️</Text>
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
              <Text className="text-2xl mr-3">☀️</Text>
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

// import axios from "axios";
// import * as Location from "expo-location";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// interface WeatherResponse {
//   name: string;
//   sys: { country: string };
//   main: { temp: number; humidity: number; feels_like: number };
//   weather: Array<{ description: string; main: string }>;
//   wind: { speed: number };
//   visibility?: number;
// }

// interface DayDetails {
//   temperature: number;
//   feelsLike: number;
//   humidity: number;
//   windSpeed: number;
//   visibility: number;
//   condition: string;
//   time: string;
// }

// interface ForecastGroup {
//   dayName: string;
//   dateString: string;
//   details: DayDetails;
// }

// export default function Home() {
//   const [city, setCity] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [currentLocationWeatherData, setCurrentLocationWeatherData] =
//     useState<WeatherResponse | null>(null);

//   // Forecast states
//   const [forecastDays, setForecastDays] = useState<ForecastGroup[]>([]);
//   const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

//   const getDayName = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { weekday: "long" });
//   };

//   const getFormattedDate = () => {
//     const date = new Date();
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   useEffect(() => {
//     const apiKey = "02cac9d89b06a9e7967e4b58288a25b1";

//     const getCurrentLocationWeather = async () => {
//       setLoading(true);

//       try {
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permission Denied",
//             "කරුණාකර කාලගුණය පෙන්වීමට Location Permission ලබා දෙන්න.",
//           );
//           setLoading(false);
//           return;
//         }

//         let location = await Location.getCurrentPositionAsync({});
//         const { latitude, longitude } = location.coords;

//         // 1. Fetch Current Weather
//         const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
//         const currentResponse =
//           await axios.get<WeatherResponse>(currentWeatherUrl);
//         setCurrentLocationWeatherData(currentResponse.data);

//         // 2. Fetch 5-Day Forecast
//         const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
//         const forecastResponse = await axios.get<any>(forecastUrl);

//         const list = forecastResponse.data.list;
//         const dailyForecasts: ForecastGroup[] = [];
//         const seenDays = new Set<string>();

//         // Loop chunks to group unique days (taking mid-day forecast data for accurate reading)
//         list.forEach((item: any) => {
//           const dateTxt = item.dt_txt.split(" ")[0]; // Get YYYY-MM-DD
//           const dayName = getDayName(item.dt_txt);
//           const isMidDay = item.dt_txt.includes("12:00:00");

//           // Pick the mid-day data or first available chunk of a new day
//           if (!seenDays.has(dayName) || isMidDay) {
//             const mappedData: ForecastGroup = {
//               dayName: dayName,
//               dateString: dateTxt,
//               details: {
//                 temperature: Math.round(item.main.temp),
//                 feelsLike: Math.round(item.main.feels_like),
//                 humidity: item.main.humidity,
//                 windSpeed: item.wind.speed,
//                 visibility: (item.visibility || 10000) / 1000, // convert meters to km
//                 condition: item.weather[0]?.main || "Clouds",
//                 time: item.dt_txt,
//               },
//             };

//             // Update or replace to ensure mid-day data is preferred
//             const existingIndex = dailyForecasts.findIndex(
//               (f) => f.dayName === dayName,
//             );
//             if (existingIndex !== -1 && isMidDay) {
//               dailyForecasts[existingIndex] = mappedData;
//             } else if (existingIndex === -1 && dailyForecasts.length < 5) {
//               dailyForecasts.push(mappedData);
//               seenDays.add(dayName);
//             }
//           }
//         });

//         setForecastDays(dailyForecasts);
//       } catch (error) {
//         console.log("Fetch Error: ", error);
//         Alert.alert(
//           "Error",
//           "ඔබගේ වත්මන් ස්ථානයේ කාලගුණය ලබා ගැනීමට අපොහොසත් විය.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     getCurrentLocationWeather();
//   }, []);

//   const activeForecast = forecastDays[selectedDayIndex]?.details;

//   if (loading) {
//     return (
//       <View className="flex-1 items-center justify-center bg-slate-50">
//         <ActivityIndicator size="large" color="#2563eb" />
//         <Text className="mt-4 text-slate-500 font-medium text-sm">
//           කාලගුණ දත්ත ලබාගනිමින් පවතී...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-slate-50">
//       {/* Top Main Card */}
//       <View className="w-full bg-blue-600 rounded-b-[40px] px-6 pt-12 pb-8 shadow-xl shadow-blue-500/10">
//         <View className="flex-row justify-between items-center mb-6">
//           <View>
//             <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider">
//               📍 Current Location
//             </Text>
//             <Text className="text-white text-2xl font-black mt-0.5">
//               {currentLocationWeatherData
//                 ? `${currentLocationWeatherData.name}, ${currentLocationWeatherData.sys.country}`
//                 : "Searching..."}
//             </Text>
//           </View>
//           <Text className="text-white/90 text-xs bg-white/10 px-3 py-1.5 rounded-full font-medium">
//             {getFormattedDate()}
//           </Text>
//         </View>

//         {/* Main Temperature Details */}
//         <View className="flex-row items-center justify-between mt-2">
//           <View>
//             <Text className="text-white text-7xl font-black tracking-tighter">
//               {currentLocationWeatherData
//                 ? `${Math.round(currentLocationWeatherData.main.temp)}°C`
//                 : "--°C"}
//             </Text>
//             <Text className="text-white/90 text-sm font-medium mt-1 capitalize">
//               {currentLocationWeatherData
//                 ? currentLocationWeatherData.weather[0]?.description
//                 : "--"}
//             </Text>
//           </View>
//           <Image
//             source={require("../../assets/image/cloudLive.gif")}
//             className="w-32 h-32"
//             resizeMode="contain"
//           />
//         </View>
//       </View>

//       {/* Horizontal Tabs for Days Forecast */}
//       <View className="mt-6 px-4">
//         <Text className="text-slate-900 text-lg font-bold px-2 mb-3">
//           5-Day Forecast
//         </Text>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           className="flex-row"
//           contentContainerStyle={{ paddingHorizontal: 4 }}
//         >
//           {forecastDays.map((item, index) => {
//             const isSelected = index === selectedDayIndex;
//             return (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => setSelectedDayIndex(index)}
//                 activeOpacity={0.9}
//                 className={`mr-3 px-5 py-3 rounded-2xl border items-center justify-center transition-all min-w-[95px] ${
//                   isSelected
//                     ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-500/20"
//                     : "bg-white border-slate-200"
//                 }`}
//               >
//                 <Text
//                   className={`text-xs font-semibold ${isSelected ? "text-white/80" : "text-slate-400"}`}
//                 >
//                   {index === 0 ? "Today" : item.dayName.substring(0, 3)}
//                 </Text>
//                 <Text
//                   className={`text-base font-bold mt-1 ${isSelected ? "text-white" : "text-slate-800"}`}
//                 >
//                   {item.details.temperature}°C
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </View>

//       {/* Forecast Details Grid Card */}
//       <ScrollView
//         className="flex-1 px-6 mt-6"
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 mb-8">
//           <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-5">
//             {forecastDays[selectedDayIndex]?.dayName || "Day"} Weather
//             Conditions
//           </Text>

//           {/* Row 1 */}
//           <View className="flex-row justify-between mb-6">
//             {/* Feels Like */}
//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-amber-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">🌡️</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Feels Like
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   {activeForecast ? `${activeForecast.feelsLike} °C` : "-- °C"}
//                 </Text>
//               </View>
//             </View>

//             {/* Humidity */}
//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-blue-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">💧</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Humidity
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   {activeForecast ? `${activeForecast.humidity}%` : "--%"}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Row 2 */}
//           <View className="flex-row justify-between mb-6">
//             {/* Condition */}
//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-purple-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">☁️</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Condition
//                 </Text>
//                 <Text
//                   className="text-slate-800 text-sm font-bold mt-0.5"
//                   numberOfLines={1}
//                 >
//                   {activeForecast ? activeForecast.condition : "--"}
//                 </Text>
//               </View>
//             </View>

//             {/* Wind Speed */}
//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-teal-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">💨</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Wind Speed
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   {activeForecast
//                     ? `${activeForecast.windSpeed} km/h`
//                     : "-- km/h"}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Row 3 */}
//           <View className="flex-row justify-between">
//             {/* Visibility */}
//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-emerald-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">👁️</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Visibility
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   {activeForecast
//                     ? `${activeForecast.visibility.toFixed(1)} km`
//                     : "-- km"}
//                 </Text>
//               </View>
//             </View>

//             {/* Premium Touch Badge */}
//             <View className="w-[45%] flex-row items-center opacity-40">
//               <View className="h-10 w-10 bg-indigo-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">✨</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Status
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   Verified
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// import axios from "axios";
// import * as Location from "expo-location";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// interface WeatherResponse {
//   name: string;
//   sys: { country: string };
//   main: { temp: number; humidity: number; feels_like: number };
//   weather: Array<{ description: string; main: string }>;
//   wind: { speed: number };
//   visibility?: number;
// }

// interface DayDetails {
//   temperature: number;
//   feelsLike: number;
//   humidity: number;
//   windSpeed: number;
//   visibility: number;
//   condition: string;
//   time: string;
// }

// interface ForecastGroup {
//   dayName: string;
//   dateString: string;
//   details: DayDetails;
// }

// export default function Home() {
//   const [city, setCity] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [currentLocationWeatherData, setCurrentLocationWeatherData] =
//     useState<WeatherResponse | null>(null);

//   // Forecast states safely initialized to empty array
//   const [forecastDays, setForecastDays] = useState<ForecastGroup[]>([]);
//   const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

//   const getDayName = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", { weekday: "long" });
//     } catch (e) {
//       return "Unknown Day";
//     }
//   };

//   const getFormattedDate = () => {
//     const date = new Date();
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   useEffect(() => {
//     const apiKey = "02cac9d89b06a9e7967e4b58288a25b1";

//     const getCurrentLocationWeather = async () => {
//       setLoading(true);

//       try {
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert(
//             "Permission Denied",
//             "කරුණාකර කාලගුණය පෙන්වීමට Location Permission ලබා දෙන්න.",
//           );
//           setLoading(false);
//           return;
//         }

//         let location = await Location.getCurrentPositionAsync({});
//         const { latitude, longitude } = location.coords;

//         // 1. Fetch Current Weather
//         const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
//         const currentResponse =
//           await axios.get<WeatherResponse>(currentWeatherUrl);
//         setCurrentLocationWeatherData(currentResponse.data);

//         // 2. Fetch 5-Day Forecast
//         const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
//         const forecastResponse = await axios.get<any>(forecastUrl);

//         if (forecastResponse.data && forecastResponse.data.list) {
//           const list = forecastResponse.data.list;
//           const dailyForecasts: ForecastGroup[] = [];
//           const seenDays = new Set<string>();

//           list.forEach((item: any) => {
//             if (!item.dt_txt) return;
//             const dateTxt = item.dt_txt.split(" ")[0];
//             const dayName = getDayName(item.dt_txt);
//             const isMidDay = item.dt_txt.includes("12:00:00");

//             if (!seenDays.has(dayName) || isMidDay) {
//               const mappedData: ForecastGroup = {
//                 dayName: dayName,
//                 dateString: dateTxt,
//                 details: {
//                   temperature: Math.round(item.main.temp),
//                   feelsLike: Math.round(item.main.feels_like),
//                   humidity: item.main.humidity,
//                   windSpeed: item.wind.speed,
//                   visibility: (item.visibility || 10000) / 1000,
//                   condition: item.weather[0]?.main || "Clouds",
//                   time: item.dt_txt,
//                 },
//               };

//               const existingIndex = dailyForecasts.findIndex(
//                 (f) => f.dayName === dayName,
//               );
//               if (existingIndex !== -1 && isMidDay) {
//                 dailyForecasts[existingIndex] = mappedData;
//               } else if (existingIndex === -1 && dailyForecasts.length < 5) {
//                 dailyForecasts.push(mappedData);
//                 seenDays.add(dayName);
//               }
//             }
//           });

//           setForecastDays(dailyForecasts);
//         }
//       } catch (error) {
//         console.log("Fetch Error: ", error);
//         Alert.alert(
//           "Error",
//           "ඔබගේ වත්මන් ස්ථානයේ කාලගුණය ලබා ගැනීමට අපොහොසත් විය.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     getCurrentLocationWeather();
//   }, []);

//   // Safe retrieval with index checks
//   const activeForecast =
//     forecastDays && forecastDays.length > selectedDayIndex
//       ? forecastDays[selectedDayIndex]?.details
//       : null;

//   if (loading) {
//     return (
//       <View className="flex-1 items-center justify-center bg-slate-50">
//         <ActivityIndicator size="large" color="#2563eb" />
//         <Text className="mt-4 text-slate-500 font-medium text-sm">
//           කාලගුණ දත්ත ලබාගනිමින් පවතී...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-slate-50">
//       {/* Top Main Card */}
//       <View className="w-full bg-blue-600 rounded-b-[40px] px-6 pt-12 pb-8 shadow-xl shadow-blue-500/10">
//         <View className="flex-row justify-between items-center mb-6">
//           <View>
//             <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider">
//               📍 Current Location
//             </Text>
//             <Text className="text-white text-2xl font-black mt-0.5">
//               {currentLocationWeatherData
//                 ? `${currentLocationWeatherData.name}, ${currentLocationWeatherData.sys.country}`
//                 : "Searching..."}
//             </Text>
//           </View>
//           <Text className="text-white/90 text-xs bg-white/10 px-3 py-1.5 rounded-full font-medium">
//             {getFormattedDate()}
//           </Text>
//         </View>

//         {/* Main Temperature Details */}
//         <View className="flex-row items-center justify-between mt-2">
//           <View>
//             <Text className="text-white text-7xl font-black tracking-tighter">
//               {currentLocationWeatherData
//                 ? `${Math.round(currentLocationWeatherData.main.temp)}°C`
//                 : "--°C"}
//             </Text>
//             <Text className="text-white/90 text-sm font-medium mt-1 capitalize">
//               {currentLocationWeatherData
//                 ? currentLocationWeatherData.weather[0]?.description
//                 : "--"}
//             </Text>
//           </View>
//           <Image
//             source={require("../../assets/image/cloudLive.gif")}
//             className="w-32 h-32"
//             resizeMode="contain"
//           />
//         </View>
//       </View>

//       {/* Horizontal Tabs for Days Forecast */}
//       <View className="mt-6 px-4">
//         <Text className="text-slate-900 text-lg font-bold px-2 mb-3">
//           5-Day Forecast
//         </Text>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           className="flex-row"
//           contentContainerStyle={{ paddingHorizontal: 4 }}
//         >
//           {forecastDays &&
//             forecastDays.map((item, index) => {
//               const isSelected = index === selectedDayIndex;
//               return (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => setSelectedDayIndex(index)}
//                   activeOpacity={0.9}
//                   className={`mr-3 px-5 py-3 rounded-2xl border items-center justify-center min-w-[95px] ${
//                     isSelected
//                       ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-500/20"
//                       : "bg-white border-slate-200"
//                   }`}
//                 >
//                   <Text
//                     className={`text-xs font-semibold ${isSelected ? "text-white/80" : "text-slate-400"}`}
//                   >
//                     {index === 0
//                       ? "Today"
//                       : item.dayName
//                         ? item.dayName.substring(0, 3)
//                         : "Day"}
//                   </Text>
//                   <Text
//                     className={`text-base font-bold mt-1 ${isSelected ? "text-white" : "text-slate-800"}`}
//                   >
//                     {item.details?.temperature || 0}°C
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//         </ScrollView>
//       </View>

//       {/* Forecast Details Grid Card */}
//       <ScrollView
//         className="flex-1 px-6 mt-6"
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 mb-8">
//           <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-5">
//             {(forecastDays && forecastDays[selectedDayIndex]?.dayName) || "Day"}{" "}
//             Weather Conditions
//           </Text>

//           {/* Row 1 */}
//           <View className="flex-row justify-between mb-6">
//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-amber-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">1. 🌡️</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Feels Like
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   {activeForecast ? `${activeForecast.feelsLike} °C` : "-- °C"}
//                 </Text>
//               </View>
//             </View>

//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-blue-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">2. 💧</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Humidity
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   {activeForecast ? `${activeForecast.humidity}%` : "--%"}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Row 2 */}
//           <View className="flex-row justify-between mb-6">
//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-purple-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">3. ☁️</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Condition
//                 </Text>
//                 <Text
//                   className="text-slate-800 text-sm font-bold mt-0.5"
//                   numberOfLines={1}
//                 >
//                   {activeForecast ? activeForecast.condition : "--"}
//                 </Text>
//               </View>
//             </View>

//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-teal-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">4. 💨</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Wind Speed
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   {activeForecast
//                     ? `${activeForecast.windSpeed} km/h`
//                     : "-- km/h"}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Row 3 */}
//           <View className="flex-row justify-between">
//             <View className="w-[45%] flex-row items-center">
//               <View className="h-10 w-10 bg-emerald-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">5. 👁️</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Visibility
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   {activeForecast
//                     ? `${activeForecast.visibility.toFixed(1)} km`
//                     : "-- km"}
//                 </Text>
//               </View>
//             </View>

//             <View className="w-[45%] flex-row items-center opacity-40">
//               <View className="h-10 w-10 bg-indigo-50 rounded-xl items-center justify-center mr-3">
//                 <Text className="text-xl">6. ✨</Text>
//               </View>
//               <View>
//                 <Text className="text-slate-400 text-xs font-semibold">
//                   Status
//                 </Text>
//                 <Text className="text-slate-800 text-base font-bold mt-0.5">
//                   Verified
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
