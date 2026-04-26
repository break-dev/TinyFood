import { Tabs, Redirect } from "expo-router";
import { useAuthState } from "../../common/logic/use-auth-state";
import { routes } from "../../common/utils/variables/routes";
import { Ionicons } from "@expo/vector-icons";

export default function PrivateLayout() {
  const { usuario, isInitialized } = useAuthState();

  if (!isInitialized) return null;

  if (!usuario) {
    return <Redirect href={routes.auth as any} />;
  }

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              size={size + 4}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size + 4}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size + 4}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
