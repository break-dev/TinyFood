import React from 'react';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { WidgetAgua } from './widgets/WidgetAgua';
import { WidgetVencimiento } from './widgets/WidgetVencimiento';
import { WidgetRecetas } from './widgets/WidgetRecetas';
import { WidgetEjercicio } from './widgets/WidgetEjercicio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_FETCH_TASK = 'background-widget-update';

// Helper: Calcular días para expirar
function getDaysDifference(dateStr: string): number {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return 999;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  
  const expiry = new Date(year, month, day);
  const today = new Date();
  expiry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Función exportada para actualizar todos los widgets en tiempo real
export async function updateAllWidgets() {
  try {
    // 1. Cargar Meta de Agua y días de aviso
    const storeStr = await AsyncStorage.getItem('tinyfood-config-storage');
    let dailyGoal = 2000;
    let avisoDiasCaducidad = 3;
    if (storeStr) {
      try {
        const parsed = JSON.parse(storeStr);
        if (parsed.state) {
          if (parsed.state.metaAguaDiaria) dailyGoal = parsed.state.metaAguaDiaria;
          if (parsed.state.avisoDiasCaducidad !== undefined) avisoDiasCaducidad = parsed.state.avisoDiasCaducidad;
        }
      } catch (e) {}
    }

    // 2. Cargar Consumo de agua de hoy
    let currentWater = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const waterStr = await AsyncStorage.getItem('tinyfood_water_today');
    if (waterStr) {
      try {
        const parsed = JSON.parse(waterStr);
        if (parsed.date === todayStr) {
          currentWater = parsed.amount || 0;
        }
      } catch (e) {}
    }

    // 3. Alimentos vencidos / por vencer
    const foodsStr = await AsyncStorage.getItem('tinyfood_cached_foods');
    let foods: any[] = [];
    if (foodsStr) {
      try {
        foods = JSON.parse(foodsStr) || [];
      } catch (e) {}
    }

    const alertFoods = foods
      .map(f => {
        const days = f.fecha_vencimiento ? getDaysDifference(f.fecha_vencimiento) : 999;
        return { ...f, days };
      })
      .filter(f => f.days <= avisoDiasCaducidad)
      .sort((a, b) => a.days - b.days);

    const totalVencidos = alertFoods.filter(f => f.days < 0).length;
    const totalPorVencer = alertFoods.filter(f => f.days >= 0 && f.days <= avisoDiasCaducidad).length;

    // Obtener índices actuales para rotación
    let expireIndex = 0;
    const indexStr = await AsyncStorage.getItem('tinyfood_expire_index');
    if (indexStr) expireIndex = parseInt(indexStr, 10) || 0;

    let activeProduct: string | null = null;
    let daysToExpire: number | null = null;

    if (alertFoods.length > 0) {
      const idx = Math.abs(expireIndex) % alertFoods.length;
      activeProduct = alertFoods[idx].nombre;
      daysToExpire = alertFoods[idx].days;
    }

    let recipePhraseIndex = 0;
    const rIndexStr = await AsyncStorage.getItem('tinyfood_recipe_index');
    if (rIndexStr) recipePhraseIndex = parseInt(rIndexStr, 10) || 0;

    let exercisePhraseIndex = 0;
    const eIndexStr = await AsyncStorage.getItem('tinyfood_exercise_index');
    if (eIndexStr) exercisePhraseIndex = parseInt(eIndexStr, 10) || 0;

    // Actualizar todos los widgets
    requestWidgetUpdate({
      widgetName: 'WidgetAgua',
      renderWidget: () => React.createElement(WidgetAgua, { currentWater, dailyGoal }), 
    });

    requestWidgetUpdate({
      widgetName: 'WidgetVencimiento',
      renderWidget: () => React.createElement(WidgetVencimiento, {
        expiringItemName: activeProduct,
        daysToExpire,
        avisoDiasCaducidad
      }), 
    });

    requestWidgetUpdate({
      widgetName: 'WidgetRecetas',
      renderWidget: () => React.createElement(WidgetRecetas, { phraseIndex: recipePhraseIndex }), 
    });

    requestWidgetUpdate({
      widgetName: 'WidgetEjercicio',
      renderWidget: () => React.createElement(WidgetEjercicio, { phraseIndex: exercisePhraseIndex }), 
    });
  } catch (error) {
    console.error('Error al actualizar widgets:', error);
  }
}

// Registra la tarea de segundo plano
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    await updateAllWidgets();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Función para registrar (llamada en la inicialización)
export async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutos
    stopOnTerminate: false, // android only
    startOnBoot: true,      // android only
  });
}
