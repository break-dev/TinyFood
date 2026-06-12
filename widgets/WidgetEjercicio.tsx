"use no memo";
import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, ColorProp } from 'react-native-android-widget';

interface Props {
  phraseIndex: number;
}

export function WidgetEjercicio({ phraseIndex }: Props) {
  // 5 frases e imágenes rotativas de ejercicios
  const exercises = [
    {
      phrase: '¡CORRE POR TU VIDA!',
      subtitle: 'La pereza no quema.',
      image: require('../assets/images/widgets/papita-ejercicio-1.png'),
    },
    {
      phrase: '¡LEVANTA ESO, DÉBIL!',
      subtitle: 'Más repeticiones ya.',
      image: require('../assets/images/widgets/papita-ejercicio-2.png'),
    },
    {
      phrase: '¡TE VAS A OXIDAR!',
      subtitle: 'Estírate, no eres metal.',
      image: require('../assets/images/widgets/papita-ejercicio-3.png'),
    },
    {
      phrase: '¡MUÉVETE YA!',
      subtitle: 'Levántate de esa silla.',
      image: require('../assets/images/widgets/papita-ejercicio-4.png'),
    },
    {
      phrase: '¡SUDAR O MORIR!',
      subtitle: 'Si no duele, no sirve.',
      image: require('../assets/images/widgets/papita-ejercicio-5.png'),
    },
  ];

  const activeIndex = Math.abs(phraseIndex) % exercises.length;
  const current = exercises[activeIndex];

  const bgColor: ColorProp = '#F9F5EB'; // Cremita suave sutil
  const phraseColor: ColorProp = '#374151'; // Gris oscuro
  const subtitleColor: ColorProp = '#6b7280'; // Gris medio

  return (
    <FlexWidget
      clickAction="OPEN_APP" // Abre la app al tocarlo
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
      <FlexWidget style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
        <ImageWidget
          image={current.image}
          imageWidth={90}
          imageHeight={90}
          style={{ width: 90, height: 90 }}
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
    </FlexWidget>
  );
}
