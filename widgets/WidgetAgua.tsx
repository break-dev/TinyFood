"use no memo";
import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, ColorProp } from 'react-native-android-widget';

interface Props {
  currentWater: number;
  dailyGoal: number;
}

export function WidgetAgua({ currentWater, dailyGoal }: Props) {
  const glassSize = 250; // Cada vaso es de 250ml
  const totalGlasses = Math.max(Math.round(dailyGoal / glassSize), 1);
  const currentGlasses = Math.round(currentWater / glassSize);
  const isGoalMet = currentWater >= dailyGoal;

  // Meta diaria en Litros (ej: 2000ml -> 2.0L)
  const goalInLiters = (dailyGoal / 1000).toFixed(1);

  // Frases dinámicas basadas en el progreso sin emojis
  let phrase = '¡ESTÁS SECO!';
  let subtitle = '¿Quieres que me muera?';
  let imageSource = require('../assets/images/widgets/papita-agua-1.png');
  
  if (currentWater >= dailyGoal + 500) {
    // 4. Exceso
    phrase = '¡INUNDACIÓN!';
    subtitle = 'Te vas a ahogar, bájale.';
    imageSource = require('../assets/images/widgets/papita-agua-4.png');
  } else if (isGoalMet) {
    // 3. Meta lograda
    phrase = '¡MILAGRO!';
    subtitle = 'Meta diaria lograda.';
    imageSource = require('../assets/images/widgets/papita-agua-3.png');
  } else if (currentGlasses > 0) {
    // 2. En progreso
    phrase = '¡MÁS H2O!';
    subtitle = 'Aún te falta para la meta.';
    imageSource = require('../assets/images/widgets/papita-agua-2.png');
  }

  // Colores fijos elegantes
  const bgColor: ColorProp = '#F9F5EB'; // Cremita muy sutil y suave
  const phraseColor: ColorProp = '#374151'; // Gris oscuro para frase
  const subtitleColor: ColorProp = '#6b7280'; // Gris medio
  const celesteColor: ColorProp = '#0ea5e9'; // Celeste para agua
  const rosaColor: ColorProp = '#ec4899'; // Rosa para cambiar meta

  // Generar segmentos de progreso
  const maxVisualSegments = Math.min(totalGlasses, 8); // Reducido a 8 max para que entre bien
  const filledCount = Math.min(currentGlasses, maxVisualSegments);
  const segments = Array.from({ length: maxVisualSegments }, (_, i) => i < filledCount);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: bgColor,
        borderRadius: 24,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: '#E6DFD3', // Borde de relieve sutil cremita
      }}
    >
      {/* Columna Izquierda: Info, Progreso y Botones */}
      <FlexWidget style={{ flex: 1.3, height: 'match_parent', justifyContent: 'center' }}>
        <FlexWidget>
          <TextWidget
            text={phrase}
            style={{
              fontSize: 16,
              color: phraseColor,
              fontWeight: 'bold',
            }}
          />
          <TextWidget
            text={subtitle}
            style={{
              fontSize: 11,
              color: subtitleColor,
              marginTop: 1,
            }}
          />
          <TextWidget
            text={`Objetivo: ${goalInLiters}L`}
            style={{
              fontSize: 11,
              color: '#4b5563',
              fontWeight: 'bold',
              marginTop: 2,
            }}
          />
        </FlexWidget>

        {/* Barra de progreso segmentada (Estilo de vasitos de agua) */}
        <FlexWidget style={{ marginTop: 4 }}>
          <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
            {segments.map((isFilled, idx) => (
              <FlexWidget
                key={idx}
                style={{
                  width: 11,
                  height: 16,
                  backgroundColor: isFilled ? celesteColor : '#0000001A',
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  borderWidth: 1.2,
                  borderColor: isFilled ? '#0284c7' : '#00000020',
                  marginRight: 4,
                }}
              />
            ))}
          </FlexWidget>
          
          <TextWidget
            text={`${currentGlasses}/${totalGlasses} vasos`}
            style={{
              fontSize: 11,
              color: celesteColor,
              fontWeight: 'bold',
              marginTop: 2,
            }}
          />
        </FlexWidget>

        {/* Botones de Acción */}
        <FlexWidget
          style={{
            flexDirection: 'row',
            marginTop: 6,
            alignItems: 'center',
          }}
        >
          {/* Botón Beber */}
          <FlexWidget
            clickAction="DRINK_WATER"
            style={{
              backgroundColor: celesteColor,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
              marginRight: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextWidget
              text="+250ml"
              style={{
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 'bold',
              }}
            />
          </FlexWidget>

          {/* Botón Nueva Meta */}
          <FlexWidget
            clickAction="OPEN_CONFIG"
            style={{
              backgroundColor: rosaColor,
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TextWidget
              text="Meta"
              style={{
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 'bold',
              }}
            />
          </FlexWidget>
        </FlexWidget>
      </FlexWidget>

      {/* Columna Derecha: Mascota (Contenedor rígido para evitar estiramientos) */}
      <FlexWidget style={{ width: 95, height: 95, justifyContent: 'center', alignItems: 'center', marginLeft: 4 }}>
        <ImageWidget
          image={imageSource}
          imageWidth={95}
          imageHeight={95}
          style={{ width: 95, height: 95 }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
