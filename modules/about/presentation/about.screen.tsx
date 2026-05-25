import React from "react";
import { View, Text as Text, Linking, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MotiView, MotiScrollView } from "moti";
import { Info, ChevronRight, Heart as HeartIcon } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/common/logic/use-app-theme";

const TEAM = [
  {
    name: "Franklin Baca Campos",
    role: "Desarrollador",
    initials: "FB",
    color: "#FEF0E6",
    textColor: "#f97316",
    github: "https://github.com/break-dev",
    linkedin: "https://www.linkedin.com/in/franklinbacacampos/",
    instagram: "https://www.instagram.com/franklin.not/",
  },
  {
    name: "Pedro Mendoza Carranza",
    role: "Desarrollador",
    initials: "PM",
    color: "#E6F1FB",
    textColor: "#185FA5",
    github: "https://github.com/PEDROCOM12",
    linkedin:
      "https://www.linkedin.com/in/pedro-mendoza-2277b9245/?skipRedirect=true",
    instagram: "https://www.instagram.com/t3nt4.9_vlc/",
  },
  {
    name: "Yuleisy Quipuzcoa Lopez",
    role: "Desarrollador",
    initials: "YQ",
    color: "#EAF3DE",
    textColor: "#3B6D11",
    github: "https://github.com/YuleisyQuipuzcoa22",
    linkedin: "https://www.linkedin.com/in/yuleisyquipuzcoa/",
    instagram: "https://www.instagram.com/yuleql.22_/",
  },
  {
    name: "Ana Belén Sanchez Boy",
    role: "Desarrollador",
    initials: "AB",
    color: "#FBEAF0",
    textColor: "#993556",
    github: "https://github.com/ABSanxd",
    linkedin:
      "https://www.linkedin.com/in/ana-belen-del-pilar-sanchez-boy-4b7564339/",
    instagram: "https://www.instagram.com/a.b_san/",
  },
];

const SOCIAL = [
  {
    label: "Instagram",
    icon: "logo-instagram" as const,
    url: "https://www.instagram.com/the_berlin.crew/",
  },
];

export const AboutScreen = () => {
  const insets = useSafeAreaInsets();
  const { isDark, themeBg, themeText, themeCardBg, themeBorder } = useAppTheme();
  const openLink = (url: string) => Linking.openURL(url);

  return (
    <View className={`flex-1 ${themeBg}`} style={{ paddingTop: insets.top }}>
      <MotiScrollView
        showsVerticalScrollIndicator={false}
        className={`flex-1 p-6 ${themeBg}`}
      >
        <View className="items-center mb-10 mt-4">
          <MotiView
            from={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-6 rounded-[32px] mb-6 shadow-sm border ${
              isDark ? "bg-orange-950/20 border-orange-900/30" : "bg-orange-50 border-orange-100"
            }`}
          >
            <Info size={48} color="#f97316" strokeWidth={1.5} />
          </MotiView>
          <Text
            className={`text-4xl tracking-tighter ${themeText}`}
            style={{ fontFamily: "Outfit_900Black" }}
          >
            Sobre TinyFood
          </Text>
          <View className="bg-orange-500 px-4 py-1.5 rounded-full mt-2">
            <Text
              className="text-white text-xs"
              style={{ fontFamily: "Outfit_900Black" }}
            >
              VERSIÓN 1.0.0
            </Text>
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          className={`p-8 rounded-[40px] mb-10 border ${
            isDark ? "bg-neutral-900 border-neutral-800" : "bg-gray-50 border-gray-100"
          }`}
        >
          <Text
            className={`leading-7 text-xl text-center ${isDark ? "text-neutral-300" : "text-gray-600"}`}
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            TinyFood es una iniciativa diseñada para reducir el desperdicio de
            alimentos en el hogar, utilizando inteligencia artificial para
            gestionar tu despensa de forma inteligente.
          </Text>
        </MotiView>

        {/* Equipo */}
        <Text
          className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-[4px] mb-6 ml-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          EQUIPO DE DESARROLLO
        </Text>

        <View className="gap-4 mb-10">
          {TEAM.map((member, i) => (
            <MotiView
              key={i}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 400 + i * 100 }}
              className={`flex-row items-center border p-4 rounded-[32px] shadow-sm ${
                isDark ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-100"
              }`}
            >
              <View
                style={{ backgroundColor: member.color }}
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
              >
                <Text
                  className="text-base"
                  style={{
                    fontFamily: "Outfit_900Black",
                    color: member.textColor,
                  }}
                >
                  {member.initials}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className={`text-lg ${themeText}`}
                  style={{ fontFamily: "Outfit_700Bold" }}
                >
                  {member.name}
                </Text>
                <Text
                  className="text-gray-400 dark:text-neutral-500 text-xs uppercase tracking-widest"
                  style={{ fontFamily: "Outfit_400Regular" }}
                >
                  {member.role}
                </Text>
              </View>
              <View className="flex-row gap-2">
                {[
                  {
                    iconName: "logo-instagram" as const,
                    url: member.instagram,
                  },
                  { iconName: "logo-github" as const, url: member.github },
                  { iconName: "logo-linkedin" as const, url: member.linkedin },
                ].map((social, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => openLink(social.url)}
                    className={`w-10 h-10 rounded-xl items-center justify-center border ${
                      isDark ? "bg-neutral-950 border-neutral-800" : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <Ionicons
                      name={social.iconName}
                      size={16}
                      color={isDark ? "#a3a3a3" : "#6b7280"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </MotiView>
          ))}
        </View>

        {/* Solo IG grupal */}
        <Text
          className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-[4px] mb-6 ml-1"
          style={{ fontFamily: "Outfit_900Black" }}
        >
          SÍGUENOS
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => openLink(SOCIAL[0].url)}
          className={`flex-row items-center border rounded-[32px] px-6 py-5 mb-12 shadow-sm ${
            isDark ? "bg-orange-950/20 border-orange-900/30" : "bg-orange-50 border-orange-100 shadow-orange-500/10"
          }`}
        >
          <Ionicons name="logo-instagram" size={24} color="#f97316" />
          <Text
            className={`text-lg ml-4 ${isDark ? "text-orange-300" : "text-orange-900"}`}
            style={{ fontFamily: "Outfit_700Bold" }}
          >
            @the_berlin.crew
          </Text>
          <View className="flex-1" />
          <ChevronRight size={20} color="#f97316" strokeWidth={3} />
        </TouchableOpacity>

        <View className="items-center mb-20">
          <View className="flex-row items-center mb-2">
            <Text
              className="text-gray-300 dark:text-neutral-600 text-sm"
              style={{ fontFamily: "Outfit_400Regular" }}
            >
              Hecho con{" "}
            </Text>
            <HeartIcon size={14} color="#ef4444" fill="#ef4444" />
            <Text
              className="text-gray-300 dark:text-neutral-600 text-sm"
              style={{ fontFamily: "Outfit_400Regular" }}
            >
              {" "}
              en Perú 🇵🇪
            </Text>
          </View>
        </View>
      </MotiScrollView>
    </View>
  );
};
