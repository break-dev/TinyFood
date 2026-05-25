import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  Clock,
  Users,
  Flame,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingCart,
  ExternalLink,
  CheckCircle,
} from 'lucide-react-native';
import { useRecetas } from '../../logic/use-recetas';
import { RES_Receta } from '../../service/despensa.responses';

// ── Card de receta ─────────────────────────────────────────────────────────

const CardReceta = ({ receta, index }: { receta: RES_Receta; index: number }) => {
  const [expandida, setExpandida] = useState(false);

  const colorDificultad: Record<string, string> = {
    fácil: '#16a34a',
    media: '#f97316',
    difícil: '#ef4444',
  };
  const bgDificultad: Record<string, string> = {
    fácil: '#f0fdf4',
    media: '#fff7ed',
    difícil: '#fef2f2',
  };

  const abrirEnGoogle = () => {
    const query = encodeURIComponent(`receta ${receta.nombre}`);
    Linking.openURL(`https://www.google.com/search?q=${query}`);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 120 }}
      className="bg-white rounded-[28px] border border-gray-100 mb-4 overflow-hidden"
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
    >
      {/* ── Header ── */}
      <TouchableOpacity
        onPress={() => setExpandida((v) => !v)}
        activeOpacity={0.8}
        className="p-5"
      >
        <View className="flex-row items-start gap-3">
          <Text style={{ fontSize: 40, lineHeight: 48 }}>{receta.emoji}</Text>
          <View className="flex-1">
            <Text
              className="text-lg text-gray-900 leading-snug"
              style={{ fontFamily: 'Outfit_900Black' }}
            >
              {receta.nombre}
            </Text>
            <Text
              className="text-sm text-gray-400 mt-1 leading-relaxed"
              style={{ fontFamily: 'Outfit_400Regular' }}
            >
              {receta.descripcion}
            </Text>

            {/* Stats row */}
            <View className="flex-row flex-wrap gap-3 mt-3">
              <View className="flex-row items-center gap-1">
                <Clock size={13} color="#9ca3af" strokeWidth={2} />
                <Text className="text-xs text-gray-400" style={{ fontFamily: 'Outfit_700Bold' }}>
                  {receta.tiempo_minutos} min
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Users size={13} color="#9ca3af" strokeWidth={2} />
                <Text className="text-xs text-gray-400" style={{ fontFamily: 'Outfit_700Bold' }}>
                  {receta.porciones} {receta.porciones === 1 ? 'porción' : 'porciones'}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Flame size={13} color="#9ca3af" strokeWidth={2} />
                <Text className="text-xs text-gray-400" style={{ fontFamily: 'Outfit_700Bold' }}>
                  ~{receta.calorias_aprox} kcal/porc.
                </Text>
              </View>
              <View
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: bgDificultad[receta.dificultad] ?? '#f9fafb' }}
              >
                <Text
                  className="text-xs"
                  style={{
                    fontFamily: 'Outfit_700Bold',
                    color: colorDificultad[receta.dificultad] ?? '#6b7280',
                  }}
                >
                  {receta.dificultad}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-1">
            {expandida
              ? <ChevronUp size={20} color="#9ca3af" strokeWidth={2} />
              : <ChevronDown size={20} color="#9ca3af" strokeWidth={2} />
            }
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Contenido expandido ── */}
      {expandida && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 250 }}
          className="border-t border-gray-50"
        >
          {/* Ingredientes de la despensa */}
          <View className="px-5 pt-4">
            <Text
              className="text-[10px] text-emerald-600 uppercase tracking-widest mb-2"
              style={{ fontFamily: 'Outfit_700Bold' }}
            >
              ✅ De tu despensa
            </Text>
            <View className="gap-1.5">
              {receta.ingredientes_usados.map((ing, i) => (
                <View key={i} className="flex-row items-center gap-2">
                  <CheckCircle size={14} color="#16a34a" strokeWidth={2} />
                  <Text
                    className="text-sm text-gray-700"
                    style={{ fontFamily: 'Outfit_400Regular' }}
                  >
                    {ing}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Ingredientes extra */}
          {receta.ingredientes_extra.length > 0 && (
            <View className="px-5 pt-4">
              <View className="flex-row items-center gap-1.5 mb-2">
                <ShoppingCart size={12} color="#f97316" strokeWidth={2} />
                <Text
                  className="text-[10px] text-orange-500 uppercase tracking-widest"
                  style={{ fontFamily: 'Outfit_700Bold' }}
                >
                  Necesitas comprar
                </Text>
              </View>
              <View className="gap-1.5">
                {receta.ingredientes_extra.map((ing, i) => (
                  <Text
                    key={i}
                    className="text-sm text-gray-400"
                    style={{ fontFamily: 'Outfit_400Regular' }}
                  >
                    · {ing}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Pasos */}
          <View className="px-5 pt-4">
            <Text
              className="text-[10px] text-gray-400 uppercase tracking-widest mb-3"
              style={{ fontFamily: 'Outfit_700Bold' }}
            >
              Preparación
            </Text>
            <View className="gap-3">
              {receta.pasos.map((paso, i) => (
                <View key={i} className="flex-row gap-3">
                  <View className="h-7 w-7 rounded-full bg-orange-500 items-center justify-center shrink-0 mt-0.5">
                    <Text className="text-white text-xs" style={{ fontFamily: 'Outfit_700Bold' }}>
                      {i + 1}
                    </Text>
                  </View>
                  <Text
                    className="flex-1 text-sm text-gray-600 leading-relaxed"
                    style={{ fontFamily: 'Outfit_400Regular' }}
                  >
                    {paso.replace(/^Paso \d+:\s*/i, '')}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Link a Google */}
          <View className="px-5 pt-4 pb-5">
            <TouchableOpacity
              onPress={abrirEnGoogle}
              activeOpacity={0.8}
              className="flex-row items-center justify-center gap-2 py-3 rounded-[20px] bg-gray-50 border border-gray-100"
            >
              <ExternalLink size={15} color="#6b7280" strokeWidth={2} />
              <Text
                className="text-gray-500 text-sm"
                style={{ fontFamily: 'Outfit_700Bold' }}
              >
                Ver receta completa en Google
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      )}
    </MotiView>
  );
};

// ── Pantalla ───────────────────────────────────────────────────────────────

export const RecetasScreen = () => {
  const insets = useSafeAreaInsets();
  const { recetas, cargando, yaGeneradas, generarRecetas, limpiarRecetas } = useRecetas();

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-6">
        <Text className="text-3xl text-gray-900 tracking-tighter" style={{ fontFamily: 'Outfit_900Black' }}>
          Recetas IA 🍳
        </Text>
        <Text className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Outfit_400Regular' }}>
          Basadas en lo que tienes en tu despensa
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Estado vacío */}
        {!yaGeneradas && !cargando && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 18 }}
            className="items-center py-12"
          >
            <Text style={{ fontSize: 64 }}>🧑‍🍳</Text>
            <Text
              className="text-xl text-gray-800 mt-4 text-center"
              style={{ fontFamily: 'Outfit_900Black' }}
            >
              ¿Qué cocinamos hoy?
            </Text>
            <Text
              className="text-gray-400 text-center mt-2 mb-8 px-4"
              style={{ fontFamily: 'Outfit_400Regular' }}
            >
              La IA analizará tu despensa y sugerirá recetas usando lo que ya tienes,
              priorizando lo que está por vencer.
            </Text>
            <TouchableOpacity
              onPress={() => generarRecetas(3)}
              activeOpacity={0.85}
              className="flex-row items-center gap-2 bg-orange-500 px-8 py-4 rounded-[24px]"
              style={{ shadowColor: '#f97316', shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
            >
              <Sparkles size={20} color="white" strokeWidth={2.5} />
              <Text className="text-white text-lg" style={{ fontFamily: 'Outfit_900Black' }}>
                Sugerir recetas
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Cargando */}
        {cargando && (
          <View className="items-center py-16 gap-4">
            <ActivityIndicator size="large" color="#f97316" />
            <Text
              className="text-gray-400 text-sm text-center"
              style={{ fontFamily: 'Outfit_400Regular' }}
            >
              Analizando tu despensa...{'\n'}esto puede tomar unos segundos
            </Text>
          </View>
        )}

        {/* Recetas */}
        {yaGeneradas && !cargando && (
          <>
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-base text-gray-500" style={{ fontFamily: 'Outfit_400Regular' }}>
                {recetas.length} recetas para ti
              </Text>
              <TouchableOpacity
                onPress={() => { limpiarRecetas(); generarRecetas(3); }}
                className="flex-row items-center gap-1.5 px-4 py-2 rounded-2xl bg-gray-100"
              >
                <Sparkles size={14} color="#6b7280" strokeWidth={2} />
                <Text className="text-gray-600 text-sm" style={{ fontFamily: 'Outfit_700Bold' }}>
                  Regenerar
                </Text>
              </TouchableOpacity>
            </View>

            {recetas.map((receta, index) => (
              <CardReceta key={index} receta={receta} index={index} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};