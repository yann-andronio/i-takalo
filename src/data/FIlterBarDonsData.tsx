import React from "react";
import type { ReactElement } from "react";
import { 
  ChairIcon, 
  GameControllerIcon, 
  CameraIcon, 
  HandbagIcon, 
  SneakerIcon, 
  PantsIcon, 
  DressIcon, 
  TShirtIcon, 
  HouseIcon, 
} from "phosphor-react-native";

export interface FilterItem {
  label: string;
  value: string;
  icon: (active: boolean) => ReactElement;
}

const filtersBarDonDataCategirue: FilterItem[] = [
  {
    label: "Tous",
    value: "all",
    icon: (active: boolean) => <HouseIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "T-shirts",
    value: "T_SHIRT", 
    icon: (active: boolean) => <TShirtIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Robes",
    value: "ROBE",
    icon: (active: boolean) => <DressIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Pantalons",
    value: "PANTALON",
    icon: (active: boolean) => <PantsIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Chaussures",
    value: "CHAUSSURE",
    icon: (active: boolean) => <SneakerIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Vestes",
    value: "VESTE",
    icon: (active: boolean) => <ChairIcon size={18} color={active ? "white" : "black"} />, 
  },
];

export default filtersBarDonDataCategirue;
