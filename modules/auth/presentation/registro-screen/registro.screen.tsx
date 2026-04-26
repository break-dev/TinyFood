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
import { StepMedical } from "./components/step-medical";

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

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Header */}
          <View className="mb-10 flex-row items-center justify-between">
            <View className="flex-row gap-1">
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  className={`h-2 w-8 rounded-full ${
                    s <= step ? "bg-orange-500" : "bg-gray-200"
                  }`}
                />
              ))}
            </View>
            <TouchableOpacity onPress={handleSkip}>
              <Text className="font-bold text-orange-500">Saltar</Text>
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
            {step === 3 && (
              <StepMedical data={formData} setData={setFormData} />
            )}
          </View>

          {/* Footer Navigation */}
          <View className="mt-8 flex-row gap-4">
            {step > 1 && (
              <TouchableOpacity
                onPress={prevStep}
                className="items-center justify-center rounded-2xl bg-gray-100 px-6 py-5"
              >
                <Ionicons name="arrow-back" size={24} color="#374151" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={nextStep}
              disabled={loading}
              className="flex-1 flex-row items-center justify-center rounded-2xl bg-orange-500 py-5 shadow-lg shadow-orange-500/30"
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
