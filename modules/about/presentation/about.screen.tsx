import React from "react";
import {
  View,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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
  const openLink = (url: string) => Linking.openURL(url);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-6">
        <View className="items-center mb-8">
          <View className="bg-orange-100 p-4 rounded-full mb-4">
            <Ionicons name="information-circle" size={48} color="#f97316" />
          </View>
          <Text className="text-3xl font-bold text-gray-800">
            Sobre TinyFood
          </Text>
          <Text className="text-orange-500 font-medium">Versión 1.0.0</Text>
        </View>

        <View className="bg-gray-50 p-5 rounded-2xl mb-6">
          <Text className="text-gray-700 leading-6 text-lg">
            TinyFood es una iniciativa diseñada para reducir el desperdicio de
            alimentos en el hogar, utilizando inteligencia artificial para
            gestionar tu despensa de forma inteligente.
          </Text>
        </View>

        {/* Equipo */}
        <Text className="text-s font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Equipo de desarrollo
        </Text>
        <View className="gap-3 mb-6">
          {TEAM.map((member, i) => (
            <View
              key={i}
              className="flex-row items-center bg-white border border-gray-100 p-3 rounded-2xl"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <View
                style={{ backgroundColor: member.color, width: 40, height: 40 }}
                className="rounded-full items-center justify-center mr-3"
              >
                <Text
                  style={{ color: member.textColor }}
                  className="text-xs font-semibold"
                >
                  {member.initials}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-base">
                  {member.name}
                </Text>
                <Text className="text-gray-400 text-sm">{member.role}</Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => openLink(member.instagram)}
                  className="w-9 h-9 rounded-lg border border-gray-100 items-center justify-center"
                >
                  <Ionicons name="logo-instagram" size={18} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openLink(member.github)}
                  className="w-9 h-9 rounded-lg border border-gray-100 items-center justify-center"
                >
                  <Ionicons name="logo-github" size={18} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openLink(member.linkedin)}
                  className="w-9 h-9 rounded-lg border border-gray-100 items-center justify-center"
                >
                  <Ionicons name="logo-linkedin" size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Solo IG grupal */}
        <Text className="text-s font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Síguenos
        </Text>
        <TouchableOpacity
          onPress={() => openLink(SOCIAL[0].url)}
          className="flex-row items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-6"
        >
          <Ionicons name="logo-instagram" size={18} color="#f97316" />
          <Text className="text-sm font-medium text-gray-700">
            @the_berlin.crew
          </Text>
          <View className="flex-1" />
          <Ionicons name="chevron-forward" size={14} color="#d1d5db" />
        </TouchableOpacity>

        <Text className="text-center text-s text-gray-300">
          Hecho con amor en Perú 🇵🇪
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
