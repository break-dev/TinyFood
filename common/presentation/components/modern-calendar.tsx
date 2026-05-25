import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { MotiView, AnimatePresence } from "moti";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { getMeses } from "@/common/utils/functions/get-meses";
import { getDias } from "@/common/utils/functions/get-dias";
import { useAppTheme } from "@/common/logic/use-app-theme";

// Configuración en español
LocaleConfig.locales["es"] = {
  monthNames: getMeses(),
  monthNamesShort: getMeses(true),
  dayNames: getDias(),
  dayNamesShort: getDias(true),
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";

interface Props {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
}

export const ModernCalendar = ({ value, onChange }: Props) => {
  const { isDark } = useAppTheme();
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const initialDate = value ? new Date(value) : new Date();
  const [viewingYear, setViewingYear] = useState(initialDate.getFullYear());
  const [viewingMonth, setViewingMonth] = useState(initialDate.getMonth() + 1);

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );
  const months = LocaleConfig.locales["es"].monthNames;

  const toggleYearPicker = () => {
    setShowYearPicker(!showYearPicker);
    setShowMonthPicker(false);
  };

  const toggleMonthPicker = () => {
    setShowMonthPicker(!showMonthPicker);
    setShowYearPicker(false);
  };

  return (
    <View
      style={{ backgroundColor: isDark ? "#171717" : "#ffffff" }}
      className="rounded-[40px] border border-gray-100 dark:border-neutral-800 shadow-2xl overflow-hidden"
    >
      <View className="p-4 border-b border-gray-50 dark:border-neutral-800 flex-row gap-2">
        <TouchableOpacity
          onPress={toggleMonthPicker}
          style={{ backgroundColor: isDark ? "#262626" : "#f9fafb" }}
          className="flex-row items-center px-4 py-2 rounded-2xl border border-gray-100 dark:border-neutral-800"
        >
          <Text
            className="text-gray-900 dark:text-neutral-100 mr-2"
            style={{ fontFamily: "Outfit_700Bold" }}
          >
            {months[viewingMonth - 1]}
          </Text>
          {showMonthPicker ? (
            <ChevronUp size={16} color="#f97316" />
          ) : (
            <ChevronDown size={16} color="#9ca3af" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleYearPicker}
          style={{ backgroundColor: isDark ? "#262626" : "#f9fafb" }}
          className="flex-row items-center px-4 py-2 rounded-2xl border border-gray-100 dark:border-neutral-800"
        >
          <Text
            className="text-gray-900 dark:text-neutral-100 mr-2"
            style={{ fontFamily: "Outfit_700Bold" }}
          >
            {viewingYear}
          </Text>
          {showYearPicker ? (
            <ChevronUp size={16} color="#f97316" />
          ) : (
            <ChevronDown size={16} color="#9ca3af" />
          )}
        </TouchableOpacity>

        <AnimatePresence>
          {(showYearPicker || showMonthPicker) && (
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-[80px] left-4 right-4 z-50 rounded-[32px] shadow-xl border border-gray-100 dark:border-neutral-800 p-2"
              style={{ height: 280, backgroundColor: isDark ? "#171717" : "#ffffff" }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
              >
                {showYearPicker
                  ? years.map((y: number) => (
                      <TouchableOpacity
                        key={y}
                        onPress={() => {
                          setViewingYear(y);
                          setShowYearPicker(false);
                        }}
                        style={{
                          backgroundColor:
                            viewingYear === y
                              ? "#f97316"
                              : isDark
                              ? "#262626"
                              : "#f9fafb",
                        }}
                        className="mx-2 py-4 mb-2 items-center justify-center rounded-2xl"
                      >
                        <Text
                          className={
                            viewingYear === y ? "text-white" : "text-gray-900 dark:text-neutral-100"
                          }
                          style={{
                            fontFamily:
                              viewingYear === y
                                ? "Outfit_700Bold"
                                : "Outfit_400Regular",
                            fontSize: 16,
                          }}
                        >
                          {y}
                        </Text>
                      </TouchableOpacity>
                    ))
                  : months.map((m: string, idx: number) => (
                      <TouchableOpacity
                        key={m}
                        onPress={() => {
                          setViewingMonth(idx + 1);
                          setShowMonthPicker(false);
                        }}
                        style={{
                          backgroundColor:
                            viewingMonth === idx + 1
                              ? "#f97316"
                              : isDark
                              ? "#262626"
                              : "#f9fafb",
                        }}
                        className="mx-2 py-4 mb-2 items-center justify-center rounded-2xl"
                      >
                        <Text
                          className={
                            viewingMonth === idx + 1
                              ? "text-white"
                              : "text-gray-900 dark:text-neutral-100"
                          }
                          style={{
                            fontFamily:
                              viewingMonth === idx + 1
                                ? "Outfit_700Bold"
                                : "Outfit_400Regular",
                            fontSize: 16,
                          }}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    ))}
              </ScrollView>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
 
      <View className="relative min-h-[350px] pb-4">
        <Calendar
          key={`calendar-${viewingYear}-${viewingMonth}`}
          current={`${viewingYear}-${viewingMonth.toString().padStart(2, "0")}-01`}
          onDayPress={(day: any) => {
            onChange(day.dateString);
          }}
          markedDates={{
            [value]: { selected: true, disableTouchEvent: true },
          }}
          theme={{
            backgroundColor: isDark ? "#171717" : "#ffffff",
            calendarBackground: isDark ? "#171717" : "#ffffff",
            textSectionTitleColor: "#9ca3af",
            selectedDayBackgroundColor: "#f97316",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#f97316",
            dayTextColor: isDark ? "#ffffff" : "#374151",
            textDisabledColor: isDark ? "#3f3f46" : "#d1d5db",
            dotColor: "#f97316",
            selectedDotColor: "#ffffff",
            arrowColor: "#f97316",
            disabledArrowColor: isDark ? "#3f3f46" : "#d1d5db",
            monthTextColor: isDark ? "#ffffff" : "#111827",
            indicatorColor: "#f97316",
            textDayFontFamily: "Outfit_400Regular",
            textMonthFontFamily: "Outfit_900Black",
            textDayHeaderFontFamily: "Outfit_700Bold",
            textDayFontSize: 14,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
          enableSwipeMonths={true}
        />
      </View>
    </View>
  );
};
