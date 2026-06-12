"use no memo";
import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, ColorProp } from 'react-native-android-widget';

interface Props {
  expiringItemName: string | null;
  daysToExpire: number | null;
  avisoDiasCaducidad: number;
}

export function WidgetVencimiento({ expiringItemName, daysToExpire, avisoDiasCaducidad }: Props) {
  // Configuración por defecto (Estado 1: Tranquilo)
  let phrase = '¡DESPENSA LIMPIA!';
  let subtitle = 'Todo bajo control.';
  let buttonText = 'Ver despensa';
  let imageSource = require('../assets/images/widgets/papita-caducidad-1.png');

  if (expiringItemName && daysToExpire !== null) {
    const isExpired = daysToExpire < 0;
    const isToday = daysToExpire === 0;

    buttonText = 'Consumir';

    if (isExpired || isToday) {
      // Estado 4: Urgente/Vencido (0 días o ya vencidos)
      phrase = `¡${expiringItemName.toUpperCase()} EN PELIGRO!`;
      subtitle = isToday ? '¡Caduca HOY mismo!' : `¡Venció hace ${Math.abs(daysToExpire)} días!`;
      imageSource = require('../assets/images/widgets/papita-caducidad-4.png');
    } else if (daysToExpire <= Math.max(1, Math.floor(avisoDiasCaducidad / 2))) {
      // Estado 3: Crítico/Pronto (menos de la mitad del tiempo de aviso)
      phrase = `¡MUÉVETE CON EL/LA ${expiringItemName.toUpperCase()}!`;
      subtitle = `¡Quedan solo ${daysToExpire} días!`;
      imageSource = require('../assets/images/widgets/papita-caducidad-3.png');
    } else {
      // Estado 2: Advertencia (tiempo de aviso normal)
      phrase = `¡OJO CON EL/LA ${expiringItemName.toUpperCase()}!`;
      subtitle = `Se vence en ${daysToExpire} días.`;
      imageSource = require('../assets/images/widgets/papita-caducidad-2.png');
    }
  }

  // Estilos y Colores
  const bgColor: ColorProp = '#F9F5EB'; // Cremita suave sutil
  const phraseColor: ColorProp = '#374151'; // Gris oscuro
  const subtitleColor: ColorProp = '#6b7280'; // Gris medio
  const rosaColor: ColorProp = '#ec4899'; // Rosa para botón

  return (
    <FlexWidget
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
          image={imageSource}
          imageWidth={85}
          imageHeight={85}
          style={{ width: 85, height: 85 }}
        />
      </FlexWidget>

      {/* Info en el centro */}
      <FlexWidget style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TextWidget
          text={phrase}
          style={{
            fontSize: 12,
            color: phraseColor,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        />
        <TextWidget
          text={subtitle}
          style={{
            fontSize: 10,
            color: subtitleColor,
            textAlign: 'center',
            marginTop: 1,
          }}
        />
      </FlexWidget>

      {/* Botón Consumir/Despensa abajo */}
      <FlexWidget
        clickAction="OPEN_DESPENSA" // Lleva a la despensa donde está el flujo de consumir
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
          text={buttonText}
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
