import React, { forwardRef, useCallback, useMemo, useRef, useImperativeHandle } from "react";
import { View, Platform, Keyboard } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useAppTheme } from "../../logic/use-app-theme";

interface ModalSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  onDismiss?: () => void;
  scrollable?: boolean;
}

export const ModalSheet = forwardRef<BottomSheetModal, ModalSheetProps>(
  (
    {
      children,
      snapPoints = ["94%"], // Cubre el 94% de la pantalla para evitar tapar el notch
      enablePanDownToClose = true,
      onDismiss,
      scrollable = true,
    },
    ref,
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const { isDark } = useAppTheme();

    // Exponer ref personalizado con dismiss/close demorado para sincronizar con el teclado
    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        Keyboard.dismiss();
        setTimeout(() => {
          bottomSheetRef.current?.dismiss();
        }, Platform.OS === "android" ? 150 : 50);
      },
      close: () => {
        Keyboard.dismiss();
        setTimeout(() => {
          bottomSheetRef.current?.close();
        }, Platform.OS === "android" ? 150 : 50);
      },
      snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
      snapToPosition: (position: number) => bottomSheetRef.current?.snapToPosition(position),
      expand: () => bottomSheetRef.current?.expand(),
      collapse: () => bottomSheetRef.current?.collapse(),
      forceClose: () => bottomSheetRef.current?.forceClose(),
    } as any));

    // Memoizar los snapPoints por su valor serializado para evitar cambios de referencia en cada renderizado
    const memoizedSnapPoints = useMemo(
      () => snapPoints,
      [JSON.stringify(snapPoints)]
    );

    // Configuración de animación de resorte más suave y fluida
    const animationConfigs = useMemo(() => ({
      damping: 24,
      stiffness: 140,
      mass: 0.8,
    }), []);

    // Descartar el teclado en sincronía cuando la hoja empieza a cerrarse
    const handleAnimate = useCallback((fromIndex: number, toIndex: number) => {
      if (toIndex === -1) {
        Keyboard.dismiss();
      }
    }, []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
          pressBehavior="none"
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => {
              bottomSheetRef.current?.dismiss();
            }, Platform.OS === "android" ? 150 : 50);
          }}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={memoizedSnapPoints}
        animationConfigs={animationConfigs}
        onAnimate={handleAnimate}
        enablePanDownToClose={enablePanDownToClose}
        enableDynamicSizing={false}
        keyboardBehavior={(Platform.OS === "android" ? "none" : "interactive") as any}
        keyboardBlurBehavior="restore"
        enableBlurKeyboardOnGesture={true}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#4f4f52" : "#D1D5DB",
          width: 48,
          height: 5,
        }}
        backgroundStyle={{
          borderRadius: 40,
          backgroundColor: isDark ? "#171717" : "#ffffff",
        }}
        onDismiss={onDismiss}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {scrollable ? (
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </BottomSheetScrollView>
          ) : (
            <View style={{ flex: 1, padding: 24 }}>
              {children}
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
