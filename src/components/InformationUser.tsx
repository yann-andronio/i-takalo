import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StatusBar } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { UserIcon, PencilSimpleIcon, CaretRightIcon } from 'phosphor-react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfilStackNavigation } from '../screens/ProfileScreen';
import * as yup from 'yup';
import { stylebtn } from '../styles/Styles';


export const ValidationSchema = yup.object().shape({
  first_name: yup.string().required('Le prénom est requis'),
  last_name: yup.string().required('Le nom est requis'),
  email: yup.string().email('L\'e-mail est invalide').required('L\'e-mail est requis'),
  telnumber: yup.string().nullable().defined(),
});


interface UpdateProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  telnumber: string | null;
}


interface FormFieldProps {
  label: string;
  name: keyof UpdateProfileFormData;
  control: any;
  errors: any;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const FormField = ({ label, name, control, errors, placeholder, keyboardType = 'default' }: FormFieldProps) => (
  <View className="mb-4">
    <Text className="text-gray-500 text-sm mb-1 ml-4">{label}</Text>
    <View className="bg-white flex-row items-center rounded-lg border border-gray-200  px-2 shadow-sm">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            keyboardType={keyboardType}
          />
        )}
      />
      <PencilSimpleIcon size={20} color="gray" />
    </View>
    {errors[name] && <Text className="text-red-500 mt-1 ml-4 text-sm">{errors[name].message}</Text>}
  </View>
);

export default function InformationUser() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<ProfilStackNavigation>();

  const { control, handleSubmit, formState: { errors },} = useForm<UpdateProfileFormData>({resolver: yupResolver(ValidationSchema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      telnumber: user?.telnumber ?? null,
    },
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    console.log(data);
   
  };

  const hasProfileImage = user?.image && user.image.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView className="flex-1 px-6">
        <View className="items-center  mb-8">
        
          <View className="w-32 h-32 rounded-full border-4 border-gray-300 items-center justify-center shadow-md">
            {hasProfileImage ? (
              <Image
                source={{ uri: user.image }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full rounded-full bg-gray-200 items-center justify-center">
                <UserIcon size={70} color="gray" weight="light" />
              </View>
            )}
          </View>

   
          <TouchableOpacity className="bg-[#FEF094] px-6 py-3 rounded-full mt-6 shadow-sm">
            <Text className="text-black font-semibold text-base">Modifier la photo</Text>
          </TouchableOpacity>
        </View>

  
        <View className="bg-white  rounded-xl shadow-md mb-8">
            <FormField 
                label="Prénom"
                name="first_name"
                control={control}
                errors={errors}
                placeholder="Entrez votre prénom"
            />
            <FormField 
                label="Nom"
                name="last_name"
                control={control}
                errors={errors}
                placeholder="Entrez votre nom de famille"
            />
            <FormField 
                label="Téléphone"
                name="telnumber"
                control={control}
                errors={errors}
                placeholder="Entrez votre numéro de téléphone"
                keyboardType="phone-pad"
            />
            <FormField 
                label="Email"
                name="email"
                control={control}
                errors={errors}
                placeholder="Entrez votre email"
                keyboardType="email-address"
            />
        </View>

    
        <View className="mb-6">
          <TouchableOpacity className="flex-row items-center justify-between bg-white rounded-xl p-5 mb-4 border border-gray-200 shadow-sm">
            <Text className="text-base text-gray-800 font-medium">Modifier le mot de passe</Text>
            <CaretRightIcon size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <Text className="text-base text-gray-800 font-medium">Modifier la carte d'identité</Text>
            <CaretRightIcon size={20} color="gray" />
          </TouchableOpacity>
        </View>
        
      
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className={`${stylebtn} mb-8`}
        >
          <Text className="text-black text-lg font-bold">Enregistrer les modifications</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}