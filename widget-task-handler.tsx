import React from 'react';
import { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { WidgetAgua } from './widgets/WidgetAgua';
import { WidgetVencimiento } from './widgets/WidgetVencimiento';
import { WidgetRecetas } from './widgets/WidgetRecetas';
import { WidgetEjercicio } from './widgets/WidgetEjercicio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

// Helper: Obtener agua bebida hoy
async function getWaterToday(): Promise<number> {
  const todayStr = new Date().toISOString().split('T')[0];
  const waterStr = await AsyncStorage.getItem('tinyfood_water_today');
  if (waterStr) {
    try {
      const parsed = JSON.parse(waterStr);
      if (parsed.date === todayStr) {
        return parsed.amount || 0;
      }
    } catch (e) {}
  }
  return 0;
}

// Helper: Guardar agua bebida hoy
async function setWaterToday(amount: number): Promise<void> {
  const todayStr = new Date().toISOString().split('T')[0];
  await AsyncStorage.setItem('tinyfood_water_today', JSON.stringify({
    date: todayStr,
    amount
  }));
}

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

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;

  // 1. Cargar Meta de Agua desde Zustand Config
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

  // 2. Cargar Consumo de Agua de hoy
  let currentWater = await getWaterToday();

  // 3. Procesar alimentos vencidos / por vencer
  const foodsStr = await AsyncStorage.getItem('tinyfood_cached_foods');
  let foods: any[] = [];
  if (foodsStr) {
    try {
      foods = JSON.parse(foodsStr) || [];
    } catch (e) {}
  }

  // Filtrar comidas vencidas o por vencer
  const alertFoods = foods
    .map(f => {
      const days = f.fecha_vencimiento ? getDaysDifference(f.fecha_vencimiento) : 999;
      return { ...f, days };
    })
    .filter(f => f.days <= avisoDiasCaducidad)
    .sort((a, b) => a.days - b.days);

  const totalVencidos = alertFoods.filter(f => f.days < 0).length;
  const totalPorVencer = alertFoods.filter(f => f.days >= 0 && f.days <= avisoDiasCaducidad).length;

  // Obtener producto activo para el widget de vencimiento (con rotación)
  let expireIndex = 0;
  const indexStr = await AsyncStorage.getItem('tinyfood_expire_index');
  if (indexStr) {
    expireIndex = parseInt(indexStr, 10) || 0;
  }

  let activeProduct: string | null = null;
  let daysToExpire: number | null = null;

  if (alertFoods.length > 0) {
    const idx = Math.abs(expireIndex) % alertFoods.length;
    activeProduct = alertFoods[idx].nombre;
    daysToExpire = alertFoods[idx].days;
  }

  // Obtener índice de frases para Recetas y Ejercicio
  let recipePhraseIndex = 0;
  const rIndexStr = await AsyncStorage.getItem('tinyfood_recipe_index');
  if (rIndexStr) recipePhraseIndex = parseInt(rIndexStr, 10) || 0;

  let exercisePhraseIndex = 0;
  const eIndexStr = await AsyncStorage.getItem('tinyfood_exercise_index');
  if (eIndexStr) exercisePhraseIndex = parseInt(eIndexStr, 10) || 0;

  // Manejo de Clics
  if (props.widgetAction === 'WIDGET_CLICK') {
    switch (props.clickAction) {
      case 'DRINK_WATER':
        currentWater += 250; // Sumar un vaso
        await setWaterToday(currentWater);
        break;

      case 'OPEN_CONFIG':
        await Linking.openURL('tinyfood://configuracion');
        break;

      case 'OPEN_RECIPES':
        // Rotamos frase en cada clic antes de abrir la sección
        await AsyncStorage.setItem('tinyfood_recipe_index', String(recipePhraseIndex + 1));
        await Linking.openURL('tinyfood://recetas');
        break;

      case 'OPEN_DESPENSA':
        await Linking.openURL('tinyfood://despensa');
        break;

      case 'OPEN_APP':
        await Linking.openURL('tinyfood://');
        break;

      case 'NEXT_EXPIRE_PRODUCT':
        // Rotar al siguiente producto en vencimiento
        expireIndex += 1;
        await AsyncStorage.setItem('tinyfood_expire_index', String(expireIndex));
        
        // Rotar también frases de ejercicio para mayor dinamismo
        exercisePhraseIndex += 1;
        await AsyncStorage.setItem('tinyfood_exercise_index', String(exercisePhraseIndex));
        break;

      default:
        break;
    }
  }

  // Renderizado del widget correspondiente
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
    case 'WIDGET_CLICK':
      if (widgetInfo.widgetName === 'WidgetAgua') {
        props.renderWidget(
          <WidgetAgua currentWater={currentWater} dailyGoal={dailyGoal} />
        );
      } else if (widgetInfo.widgetName === 'WidgetVencimiento') {
        // Volvemos a calcular el activeProduct por si cambió el índice
        if (alertFoods.length > 0) {
          const idx = Math.abs(expireIndex) % alertFoods.length;
          activeProduct = alertFoods[idx].nombre;
          daysToExpire = alertFoods[idx].days;
        }
        props.renderWidget(
          <WidgetVencimiento
            expiringItemName={activeProduct}
            daysToExpire={daysToExpire}
            avisoDiasCaducidad={avisoDiasCaducidad}
          />
        );
      } else if (widgetInfo.widgetName === 'WidgetRecetas') {
        props.renderWidget(
          <WidgetRecetas phraseIndex={recipePhraseIndex} />
        );
      } else if (widgetInfo.widgetName === 'WidgetEjercicio') {
        props.renderWidget(
          <WidgetEjercicio phraseIndex={exercisePhraseIndex} />
        );
      }
      break;

    default:
      break;
  }
}
