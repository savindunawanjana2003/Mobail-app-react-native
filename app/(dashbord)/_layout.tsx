import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

const layoutDashbord = () => {
  // const tabs = [
  //   { name: "Home", title: "Home", icon: "home" },
  //   { name: "locetions", title: "Locations", icon: "location" },
  //   { name: "AiChatScreen", title: "AI Chat", icon: "chatbubble-ellipses" },
  //   { name: "profile", title: "Profile", icon: "person" },
  // ];

  // const tabs = [
  //   { name: "Home", title: "Home", icon: "home" },
  //   { name: "locetions", title: "Locations", icon: "location-sharp" },
  //   { name: "AiChatScreen", title: "AI Chat", icon: "chatbox-ellipses" },
  //   { name: "profile", title: "Profile", icon: "person" },
  // ];
  const tabs = [
    { name: "Home", title: "Home", icon: "home" },
    { name: "locetions", title: "Locations", icon: "place" }, // "place" or "location-on"
    { name: "AiChatScreen", title: "AI Chat", icon: "chat" }, // "chat", "forum", or "assistant"
    { name: "profile", title: "Profile", icon: "person" },
  ];

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          name={tab.name}
          options={{
            title: tab?.title,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons
                name={tab?.icon as any}
                size={size}
                color={color}
              />
            ),
          }}
        ></Tabs.Screen>
      ))}
    </Tabs>
  );
};

export default layoutDashbord;
