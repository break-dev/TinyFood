import { Tabs, Redirect } from "expo-router";
import { View, TouchableOpacity, Text as Text } from "react-native";
import { useAuthState } from "../../common/logic/use-auth-state";
import { routes } from "../../common/utils/variables/routes";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";
import React from "react";
import { useWindowDimensions } from "react-native";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const TAB_BAR_WIDTH = width;
  const visibleRoutes = state.routes.filter((route: any) => route.name !== "recetas");
  const TAB_WIDTH = TAB_BAR_WIDTH / visibleRoutes.length;

  return (
    <View
      className="flex-row bg-white border-t border-gray-100 shadow-2xl items-center justify-around"
      style={{
        height: 64 + insets.bottom,
        paddingBottom: insets.bottom,
      }}
    >
      {visibleRoutes.map((route: any, index: number) => {
        const isFocused = state.index === state.routes.findIndex((r: any) => r.key === route.key);
        const isCenter = route.name === "despensa";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIcon = () => {
          const name = route.name;
          if (name === "about")
            return isFocused
              ? "information-circle"
              : "information-circle-outline";
          if (name === "despensa") return "home";
          if (name === "perfil") return isFocused ? "person" : "person-outline";
          return "help";
        };

        if (isCenter) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.9}
              className="items-center justify-center"
              style={{ width: TAB_WIDTH, height: "100%", position: "relative" }}
            >
              <MotiView
                animate={{
                  scale: isFocused ? 1.1 : 1,
                  translateY: isFocused ? -22 : -16,
                }}
                transition={{ type: "spring", damping: 15, mass: 0.8 }}
                className="w-16 h-16 rounded-full items-center justify-center bg-orange-500 border-4 border-white shadow-xl shadow-orange-500/40"
                style={{
                  shadowColor: "#f97316",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="home" size={28} color="white" />
              </MotiView>
              <Text
                className="text-[10px]"
                style={{
                  fontFamily: isFocused ? "Outfit_700Bold" : "Outfit_400Regular",
                  color: isFocused ? "#f97316" : "#9ca3af",
                  position: "absolute",
                  bottom: 6,
                }}
              >
                Inventario
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center h-full relative"
          >
            <MotiView
              animate={{ scaleX: isFocused ? 1 : 0, opacity: isFocused ? 1 : 0 }}
              transition={{ type: "timing", duration: 250 }}
              className="w-8 h-1 bg-orange-500 rounded-full absolute top-0"
            />
            <MotiView
              animate={{ scale: isFocused ? 1.05 : 1, translateY: isFocused ? -2 : 0 }}
              transition={{ type: "timing", duration: 200 }}
              className="items-center"
            >
              <Ionicons
                name={getIcon() as any}
                size={24}
                color={isFocused ? "#f97316" : "#9ca3af"}
              />
              <Text
                className="mt-1 text-[10px]"
                style={{
                  fontFamily: isFocused ? "Outfit_700Bold" : "Outfit_400Regular",
                  color: isFocused ? "#f97316" : "#9ca3af",
                }}
              >
                {route.name === "about" ? "Acerca De" : "Mi Perfil"}
              </Text>
            </MotiView>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function PrivateLayout() {
  const { usuario, isInitialized } = useAuthState();

  if (!isInitialized) return null;

  if (!usuario) {
    return <Redirect href={routes.auth as any} />;
  }

  return (
    <Tabs
      initialRouteName="despensa"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "shift",
      }}
    >
      <Tabs.Screen name="about" />
      <Tabs.Screen name="despensa" />
      <Tabs.Screen name="perfil" />
      <Tabs.Screen name="recetas" options={{ href: null }} />
    </Tabs>
  );
}