import React from "react";
import { RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { RES_Comida } from "../../service/despensa.responses";
import { FallbackListadoVacio } from "./components/fallback-listado-vacio";
import { ItemComida } from "./components/item-comida";

interface Props {
  comidas: RES_Comida[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  onEdit: (comida: RES_Comida) => void;
}

export const ListadoComida = ({
  comidas,
  isRefreshing,
  onRefresh,
  onDelete,
  onEdit,
}: Props) => {
  if (comidas.length === 0 && !isRefreshing) {
    return <FallbackListadoVacio />;
  }

  return (
    <FlashList<RES_Comida>
      data={comidas}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <ItemComida
          item={item}
          index={index}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#f97316"
          colors={["#f97316"]}
        />
      }
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
    />
  );
};
