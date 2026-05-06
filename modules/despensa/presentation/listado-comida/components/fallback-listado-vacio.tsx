import React from "react";
import { View, Text as RNText } from "react-native";
import { PackageSearch } from "lucide-react-native";
import { MotiView } from "moti";

export const FallbackListadoVacio = () => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 items-center justify-center py-20 mb-48"
    >
      <View className="h-32 w-32 bg-orange-50 rounded-full items-center justify-center mb-6 shadow-sm">
        <PackageSearch size={48} color="#f97316" strokeWidth={1.5} />
      </View>
      <RNText
        className="text-gray-900 text-2xl text-center px-10"
        style={{ fontFamily: "Outfit_900Black" }}
      >
        Tu despensa está lista para ser llenada
      </RNText>
      <RNText
        className="text-gray-400 text-center mt-2 px-12 text-base"
        style={{ fontFamily: "Outfit_400Regular" }}
      >
        Agrega tus alimentos para que TinyFood pueda ayudarte a evitar el
        desperdicio.
      </RNText>
    </MotiView>
  );
};
