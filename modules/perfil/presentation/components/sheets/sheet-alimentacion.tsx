import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/common/logic/use-app-theme";

interface Props {
  data: any;
  setData: (data: any) => void;
}

interface TagInputProps {
  label: string;
  placeholder: string;
  iconName: any;
  value: string;
  onChange: (value: string) => void;
}

export const TagInput = ({
  label,
  placeholder,
  iconName,
  value,
  onChange,
}: TagInputProps) => {
  const [inputText, setInputText] = useState("");
  const { isDark } = useAppTheme();

  // Obtener la lista de tags
  const tags = value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const addTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    // Evitar duplicados
    if (!tags.includes(trimmed)) {
      const updatedTags = [...tags, trimmed];
      onChange(updatedTags.join(", "));
    }
    setInputText("");
  };

  const removeTag = (indexToRemove: number) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    onChange(updatedTags.join(", "));
  };

  const handleTextChange = (val: string) => {
    // Si contiene una coma, separamos y añadimos el tag automáticamente
    if (val.includes(",")) {
      const parts = val.split(",");
      const toAdd = parts[0];
      addTag(toAdd);
      // Poner el resto en el input
      const remaining = parts.slice(1).join(",");
      setInputText(remaining);
    } else {
      setInputText(val);
    }
  };

  return (
    <View className="mb-6">
      <Text
        className="mb-3 ml-1 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500"
        style={{ fontFamily: "Outfit_700Bold" }}
      >
        {label}
      </Text>

      {/* Input container */}
      <View className="flex-row items-center rounded-2xl bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 px-4 py-2 mb-3">
        <Ionicons name={iconName} size={20} color={isDark ? "#737373" : "#9ca3af"} />
        <TextInput
          className="ml-3 flex-1"
          style={{
            fontFamily: "Outfit_400Regular",
            fontSize: 17,
            color: isDark ? "#ffffff" : "#111827",
            fontWeight: "normal",
            paddingVertical: 12,
          }}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#525252" : "#cbd5e1"}
          value={inputText}
          onChangeText={handleTextChange}
          onSubmitEditing={() => addTag(inputText)}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={() => addTag(inputText)}
          className="p-2"
        >
          <Ionicons name="add-circle" size={24} color="#f97316" />
        </TouchableOpacity>
      </View>

      {/* Tags list */}
      <View className="flex-row flex-wrap gap-2 px-1">
        {tags.map((tag, idx) => (
          <View
            key={`${tag}-${idx}`}
            className="flex-row items-center bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 px-3 py-1.5 rounded-full"
          >
            <Text
              className="text-orange-600 dark:text-orange-400 text-sm mr-1.5"
              style={{ fontFamily: "Outfit_400Regular" }}
            >
              {tag}
            </Text>
            <TouchableOpacity onPress={() => removeTag(idx)} className="p-0.5">
              <Ionicons name="close-circle" size={16} color="#f97316" />
            </TouchableOpacity>
          </View>
        ))}
        {tags.length === 0 && (
          <Text
            className="text-gray-400 dark:text-neutral-500 text-sm italic ml-1"
            style={{ fontFamily: "Outfit_400Regular" }}
          >
            Ninguno agregado aún.
          </Text>
        )}
      </View>
    </View>
  );
};

export const SheetAlimentacion = ({ data, setData }: Props) => {
  const { isDark } = useAppTheme();
  return (
    <View className="gap-4">
      <Text
        className="text-3xl text-gray-900 dark:text-white tracking-tighter mb-4"
        style={{ fontFamily: "Outfit_900Black" }}
      >
        Alimentación
      </Text>

      <TagInput
        label="Alergias / Prohibidos"
        placeholder="Escribe y presiona coma (,) o listo..."
        iconName="medkit-outline"
        value={data.alimentos_prohibidos}
        onChange={(val) => setData({ ...data, alimentos_prohibidos: val })}
      />

      <TagInput
        label="Preferencias / Dietas"
        placeholder="Escribe y presiona coma (,) o listo..."
        iconName="nutrition-outline"
        value={data.preferencias}
        onChange={(val) => setData({ ...data, preferencias: val })}
      />
    </View>
  );
};
