import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRegistrar } from "../../logic/use-registrar";
import { Ionicons } from "@expo/vector-icons";
import { StepPhysical } from "./components/step-physical";
import { StepActivity } from "./components/step-activity";
import { StepFood } from "./components/step-food";
import { StepMedical } from "./components/step-medical";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const RegistroScreen = () => {
  const {
    step,
    totalSteps,
    formData,
    setFormData,
    loading,
    nextStep,
    prevStep,
    handleSkip,
  } = useRegistrar();

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      {/* Círculos decorativos */}
      <View
        style={{ backgroundColor: "#C8E6C9" }}
        className="absolute -right-16 top-32 h-72 w-72 rounded-full opacity-50"
      />
      <View
        style={{ backgroundColor: "#E8F5E9" }}
        className="absolute -left-10 bottom-20 h-36 w-36 rounded-full opacity-70"
      />
      <View
        style={{ backgroundColor: "#C8E6C9" }}
        className="absolute right-10 bottom-1/3 h-20 w-20 rounded-full opacity-40"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header: Back + Progress + Omitir — all in one row */}
          <View className="mb-10 flex-row items-center justify-between">
            {step > 1 ? (
              <TouchableOpacity
                onPress={prevStep}
                className="h-10 w-10 items-center justify-center"
              >
                <Ionicons name="chevron-back" size={24} color="#374151" />
              </TouchableOpacity>
            ) : (
              <View className="h-10 w-10" />
            )}

            <View className="flex-row items-center gap-1">
              {[1, 2, 3, 4].map((s) => (
                <View
                  key={s}
                  className={`h-2 w-8 rounded-full ${
                    s <= step ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </View>

            <TouchableOpacity onPress={handleSkip}>
              <Text className="font-bold text-orange-500">Omitir</Text>
            </TouchableOpacity>
          </View>

          {/* Steps Content */}
          <View className="flex-1">
            {step === 1 && (
              <StepPhysical data={formData} setData={setFormData} />
            )}
            {step === 2 && (
              <StepActivity data={formData} setData={setFormData} />
            )}
            {step === 3 && <StepFood data={formData} setData={setFormData} />}
            {step === 4 && (
              <StepMedical data={formData} setData={setFormData} />
            )}
          </View>

          {/* Footer — Solo Continuar/Finalizar */}
          <View className="mt-8" style={{ paddingBottom: insets.bottom + 8 }}>
            <TouchableOpacity
              onPress={nextStep}
              disabled={loading}
              className="flex-row items-center justify-center rounded-2xl bg-orange-500 py-5 shadow-lg shadow-orange-500/30"
            >
              <Text className="mr-2 text-lg font-bold text-white">
                {step === totalSteps ? "Finalizar" : "Continuar"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
