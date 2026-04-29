import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { LucideIcon, AlertCircle, CheckCircle2, Info } from "lucide-react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "success" | "warning" | "danger";
  icon?: LucideIcon;
}

export const ElegantModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Entendido",
  cancelText = "Cancelar",
  type = "info",
  icon: CustomIcon,
}: Props) => {
  const getColor = () => {
    switch (type) {
      case "success":
        return "#22c55e";
      case "warning":
        return "#f59e0b";
      case "danger":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  const Icon = CustomIcon || (type === "success" ? CheckCircle2 : type === "warning" || type === "danger" ? AlertCircle : Info);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <AnimatePresence>
        {visible && (
          <View className="flex-1 items-center justify-center bg-black/40 px-6">
            <Pressable className="absolute inset-0" onPress={onClose} />
            
            <MotiView
              from={{ opacity: 0, scale: 0.9, translateY: 20 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, translateY: 20 }}
              transition={{ type: "timing", duration: 300 }}
              className="w-full rounded-[40px] bg-white p-8 shadow-2xl"
            >
              <View className="items-center">
                <View 
                  style={{ backgroundColor: `${getColor()}15` }}
                  className="h-20 w-20 items-center justify-center rounded-3xl mb-6"
                >
                  <Icon size={36} color={getColor()} strokeWidth={2.5} />
                </View>
                
                <Text 
                  className="mb-3 text-center text-2xl text-gray-900"
                  style={{ fontFamily: "Outfit_900Black" }}
                >
                  {title}
                </Text>
                
                <Text 
                  className="mb-8 text-center text-base leading-6 text-gray-500"
                  style={{ fontFamily: "Outfit_400Regular" }}
                >
                  {description}
                </Text>
                
                <View className="w-full flex-row gap-3">
                  {onConfirm && (
                    <TouchableOpacity
                      onPress={onClose}
                      className="flex-1 items-center justify-center rounded-2xl bg-gray-100 py-4"
                    >
                      <Text 
                        className="text-gray-600 font-bold"
                        style={{ fontFamily: "Outfit_700Bold" }}
                      >
                        {cancelText}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    onPress={() => {
                      if (onConfirm) onConfirm();
                      onClose();
                    }}
                    style={{ backgroundColor: getColor() }}
                    className="flex-1 items-center justify-center rounded-2xl py-4 shadow-lg shadow-black/10"
                  >
                    <Text 
                      className="text-white font-bold"
                      style={{ fontFamily: "Outfit_700Bold" }}
                    >
                      {confirmText}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </Modal>
  );
};
