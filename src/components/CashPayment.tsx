import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { CheckCircleIcon, MoneyIcon } from 'phosphor-react-native';

export const CashPayment: React.FC = () => {
  return (
    <View>
      <View className="p-4 mb-8 border border-green-200 bg-green-50 rounded-xl">
        <View className="mb-2 gap-3 text-base font-bold text-green-800 flex-row items-center">
          <MoneyIcon size={20} color="#059669" weight="bold" />
          <Text> Paiement en Espèces (Liquide)</Text>
        </View>
        <Text className="text-sm text-green-700">
          Vous avez choisi de payer en liquide. Le paiement se fera directement
          lors de l’échange, conformément à l’accord que vous avez déjà convenu
          avec le vendeur dans la conversation.
        </Text>
      </View>

      <TouchableOpacity className="mt-8 flex-row items-center justify-center bg-[#03233A] py-3 rounded-xl shadow-md active:opacity-90">
        <CheckCircleIcon size={22} color="white" weight="bold" />
        <Text className="ml-2 text-white font-semibold text-base">
          Confirmer le paiement
        </Text>
      </TouchableOpacity>
    </View>
  );
};
