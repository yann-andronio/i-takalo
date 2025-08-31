import React from "react";
import type { ReactElement } from "react";
import { ChairIcon, GameControllerIcon, CameraIcon, HandbagIcon, SneakerIcon, PantsIcon, DressIcon, TShirtIcon, HouseIcon, PhoneIcon, LaptopIcon, BookIcon,} from "phosphor-react-native";

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
    value: "t-shirt",
    icon: (active: boolean) => <TShirtIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Robes",
    value: "robes",
    icon: (active: boolean) => <DressIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Pantalons",
    value: "pantalons",
    icon: (active: boolean) => <PantsIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Chaussures",
    value: "chaussures",
    icon: (active: boolean) => <SneakerIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Sacs",
    value: "sacs",
    icon: (active: boolean) => <HandbagIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Téléphones",
    value: "telephones",
    icon: (active: boolean) => <PhoneIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Ordinateurs",
    value: "ordinateurs",
    icon: (active: boolean) => <LaptopIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Appareils Photo",
    value: "appareils-photo",
    icon: (active: boolean) => <CameraIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Livres",
    value: "livres",
    icon: (active: boolean) => <BookIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Jeux",
    value: "jeux",
    icon: (active: boolean) => <GameControllerIcon size={18} color={active ? "white" : "black"} />,
  },
  {
    label: "Meubles",
    value: "meubles",
    icon: (active: boolean) => <ChairIcon size={18} color={active ? "white" : "black"} />,
  },
];

export default filtersBarDonDataCategirue;
