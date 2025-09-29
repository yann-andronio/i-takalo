import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import { PhoneIcon, UserIcon, HashIcon, CheckCircleIcon } from 'phosphor-react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type Operator = 'telma' | 'airtel' | 'orange';

type FormData = {
  phoneNumber: string;
  nomcompte: string;
  reference: string;
};

const validationSchema = yup.object({
  phoneNumber: yup.string().required('Le numéro est obligatoire').matches(/^(032|033|034|038)\d{7}$/, 'Numéro invalide (ex: 0341234567)'),
  nomcompte: yup.string().required('Le nom du compte est obligatoire'),
  reference: yup.string().required('La référence est obligatoire'),
});


const InputField = ({ label, icon: Icon, control, name, placeholder, keyboardType }: any) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-semibold text-gray-700">{label}</Text>
    <View className="flex-row items-center px-3 py-[0.5%] border border-gray-300 rounded-lg bg-gray-50">
      <Icon size={18} color="#4B5563" weight="duotone" />
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
            className="flex-1 ml-2 text-[15px] text-gray-800"
          />
        )}
      />
    </View>
  </View>
);

export default function MobileMoneyPayment() {
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [errorOperator, setErrorOperator] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    // 'onChange' met à jour 'isValid' à chaque changement de champ
    mode: 'onChange', 
  });

   const isButtonDisabled = !isValid || !selectedOperator;

  const operators = [
    { id: 'telma', label: 'MVola', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Telma_logo.png' },
    { id: 'airtel', label: 'Airtel Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Airtel_logo_2010.png' },
    { id: 'orange', label: 'Orange Money', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Orange_logo.svg' },
  ];

  const onSubmit = (data: FormData) => {
    if (!selectedOperator) {
      setErrorOperator(true);
      return;
    }
    console.log('Formulaire valide  sady vita achat', { ...data, selectedOperator });
  
  };

  return (
    <View className="flex-1 px-6 py-5 bg-white">
      <Text className="mb-4 text-lg font-bold text-gray-800">Choisir un opérateur Mobile Money</Text>

      <View className="flex-row justify-between mb-4">
        {operators.map(op => (
          <TouchableOpacity
            key={op.id}
            onPress={() => {
              setSelectedOperator(op.id as Operator);
              setErrorOperator(false);
            }}
            className={`flex-1 mx-1 items-center p-3 rounded-xl border ${selectedOperator === op.id ? 'border-[#03233A] bg-[#03233A]/5' : 'border-gray-200 bg-gray-50'}`}
          >
            <Image source={{ uri: op.logo }} className="w-10 h-10 mb-1" resizeMode="contain" />
            <Text className={`text-[11px] font-semibold ${selectedOperator === op.id ? 'text-[#03233A]' : 'text-gray-600'}`}>{op.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

     
      {errorOperator && (
        <View className="mb-4 flex-row items-center bg-red-100 border border-red-400 px-3 py-2 rounded-lg">
          <Text className="text-red-700 font-medium text-sm">⚠️ Veuillez choisir un opérateur</Text>
        </View>
      )}

    
      <InputField label="Numéro de téléphone" icon={PhoneIcon} control={control} name="phoneNumber" placeholder="Ex: 0341234567" keyboardType="phone-pad" />
      {errors.phoneNumber && <Text className="mb-2 text-xs text-red-500">{errors.phoneNumber.message}</Text>}

      <InputField label="Nom du compte" icon={UserIcon} control={control} name="nomcompte" placeholder="Nom complet du titulaire" />
      {errors.nomcompte && <Text className="mb-2 text-xs text-red-500">{errors.nomcompte.message}</Text>}

      <InputField label="Référence" icon={HashIcon} control={control} name="reference" placeholder="Ex: 05191698" />
      {errors.reference && <Text className="mb-2 text-xs text-red-500">{errors.reference.message}</Text>}

     <TouchableOpacity
    onPress={handleSubmit(onSubmit)}
    disabled={isButtonDisabled} 
    className={`mt-6 flex-row items-center justify-center py-3 rounded-xl shadow-md ${isButtonDisabled ? 'bg-gray-400' : 'bg-[#03233A] active:opacity-90'}`}
>
    <CheckCircleIcon size={22} color="white" weight="bold" />
    <Text className="ml-2 text-white font-semibold text-base">Confirmer le paiement</Text>
</TouchableOpacity>
    </View>
  );
}


