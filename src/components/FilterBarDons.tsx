
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import type { ReactElement } from "react";
import filtersBarDonDataCategirue from "../data/FIlterBarDonsData"

interface FilterButtonProps {
  label: string;
  icon: (active: boolean) => ReactElement;
  active: boolean;
  onPress: () => void;
}

interface FilterBarDonsProps {
  onApplyFilters: (filters: any) => void;
  isselectfilterDonation: string;
}

const FilterButton = ({ label, icon, active, onPress }: FilterButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-2 rounded-xl mr-3 ${active ? "bg-[#FEF094]" : "border border-gray-300"}`}
    >
      {icon(active)}
      <Text className={`ml-2 text-base font-medium ${active ? "text-[#03233A]" : "text-gray-700"}`}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function FilterBarDons({ onApplyFilters, isselectfilterDonation }: FilterBarDonsProps) {
  const getFilterData = (value: string) => {
   

    const baseFilters = {
      types: "DONATION",
      category: "all",
      genre: "all",
      style: "all",
      saison: "all",
      minPrice: "",
      maxPrice: "",
    };

    if (value === "all") {
      return { ...baseFilters, types: "all" };
    } else {
      return { ...baseFilters, category: value };
    }
  };

  return (
    <View className="mt-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filtersBarDonDataCategirue.map((f) => (
          <FilterButton
            key={f.value}
            label={f.label}
            icon={f.icon}
            active={isselectfilterDonation === f.value}
            onPress={() => onApplyFilters(getFilterData(f.value))}
          />
        ))}
      </ScrollView>
    </View>
  );
}
