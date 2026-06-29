"use no memo";
import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, ColorProp } from 'react-native-android-widget';

interface Props {
  phraseIndex?: number;
}

export function WidgetRecetas({ phraseIndex = 0 }: Props) {
  // 3 frases e imágenes rotativas de antojos/comida rápida
  const recipes = [
    {
      phrase: '¿UNA HAMBURGUESA?',
      subtitle: 'Mejor cocina sano con tu despensa.',
      image: require('../assets/images/widgets/papita-recetas-1.png'),
    },
    {
      phrase: '¿OTRA PIZZA MÁS?',
      subtitle: 'Tu cuerpo necesita comida real. ¡Cocina!',
      image: require('../assets/images/widgets/papita-recetas-2.png'),
    },
    {
      phrase: '¿ANTOJO DE CHATARRA?',
      subtitle: 'Usa la IA y crea algo nutritivo.',
      image: require('../assets/images/widgets/papita-recetas-3.png'),
    },
  ];

  const activeIndex = Math.abs(phraseIndex) % recipes.length;
  const current = recipes[activeIndex];

  // Estilos y Colores
  const bgColor: ColorProp = '#F9F5EB'; // Cremita suave sutil
  const phraseColor: ColorProp = '#374151'; // Gris oscuro
  const subtitleColor: ColorProp = '#6b7280'; // Gris medio
  const rosaColor: ColorProp = '#ec4899'; // Rosa para botón

  return (
    <FlexWidget
      clickAction="OPEN_RECIPES" // Abre el flujo de recetas por IA al tocar cualquier parte del widget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: bgColor,
        borderRadius: 24,
        padding: 12,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#E6DFD3', // Borde de relieve sutil cremita
      }}
    >
      {/* Mascota arriba (Contenedor rígido para evitar estiramientos) */}
      <FlexWidget style={{ width: 85, height: 85, justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
        <ImageWidget
          image={current.image}
          imageWidth={85}
          imageHeight={85}
          style={{ width: 85, height: 85 }}
        />
      </FlexWidget>

      {/* Info en el centro */}
      <FlexWidget style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TextWidget
          text={current.phrase}
          style={{
            fontSize: 12,
            color: phraseColor,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        />
        <TextWidget
          text={current.subtitle}
          style={{
            fontSize: 10,
            color: subtitleColor,
            textAlign: 'center',
            marginTop: 1,
          }}
        />
      </FlexWidget>

      {/* Botón Cocinar con IA abajo */}
      <FlexWidget
        clickAction="GENERATE_RECIPE" // Abre el flujo de recetas por IA
        style={{
          backgroundColor: rosaColor,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 5,
          marginTop: 6,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TextWidget
          text="Cocinar con IA"
          style={{
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
