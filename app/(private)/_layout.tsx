import { Tabs, Redirect } from "expo-router";
import { View, TouchableOpacity, Text as RNText } from "react-native";
import { useAuthState } from "../../common/logic/use-auth-state";
import { routes } from "../../common/utils/variables/routes";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView } from "moti";
import React from "react";
import { useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const TAB_BAR_WIDTH = width - 48; 
  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length;
  
  return (
    <View 
      className="flex-row bg-white absolute bottom-6 left-6 right-6 rounded-[36px] border border-gray-100 shadow-2xl items-center justify-around h-20"
      style={{ paddingBottom: 0, overflow: 'hidden' }}
    >
      {/* Curved Indicator at the bottom */}
      <MotiView
        animate={{
          translateX: (state.index * TAB_WIDTH) - (TAB_BAR_WIDTH / 2) + (TAB_WIDTH / 2),
        }}
        transition={{ 
          type: "timing", 
          duration: 350,
        }}
        className="absolute bottom-0 h-4 items-center justify-center"
        style={{ width: TAB_WIDTH }}
      >
        <Svg width={60} height={16} viewBox="0 0 60 16" fill="none">
          <Path 
            d="M0 16C15 16 15 0 30 0C45 0 45 16 60 16H0Z" 
            fill="#f97316" 
            opacity={0.15}
          />
          <Path 
            d="M15 16C22.5 16 22.5 8 30 8C37.5 8 37.5 16 45 16H15Z" 
            fill="#f97316" 
          />
        </Svg>
      </MotiView>

      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

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
          if (name === "about") return isFocused ? "information-circle" : "information-circle-outline";
          if (name === "despensa") return isFocused ? "home" : "home-outline";
          if (name === "perfil") return isFocused ? "person" : "person-outline";
          return "help";
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center h-full"
          >
            <MotiView
              animate={{
                scale: isFocused ? 1.15 : 1,
                translateY: isFocused ? -4 : 0,
              }}
              transition={{ type: "timing", duration: 300 }}
            >
              <Ionicons
                name={getIcon() as any}
                size={26}
                color={isFocused ? "#f97316" : "#9ca3af"}
              />
            </MotiView>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function PrivateLayout() {
  const { usuario, isInitialized } = useAuthState();
  const insets = useSafeAreaInsets();

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
    </Tabs>
  );
}
