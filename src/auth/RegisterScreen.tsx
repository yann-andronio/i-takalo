import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';

interface RegisterFormData {
  name: string;
  prenom: string; 
  email: string;
  password: string;
  confirmPassword: string; 
}

const ValidationSchema = yup.object({
  name: yup.string().required('Veuillez entrer votre nom'),
  prenom: yup.string().required('Veuillez entrer votre prénom'),
  email: yup.string().email('Email invalide').required('Veuillez entrer votre email'),
  password: yup.string().min(6, 'Au moins 6 caractères').required('Mot de passe requis'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre').required('Veuillez confirmer votre mot de passe'),
});

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register: registerUser } = useContext(AuthContext);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: yupResolver(ValidationSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log('Register:', data);
    registerUser(data); 
    reset();
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white', justifyContent: 'flex-end' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', padding: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold mb-5">S’inscrire</Text>

          <Text>Nom:</Text>
          <TextInput
            placeholder="Votre nom"
            className={`bg-white text-black w-full p-3 border rounded-lg ${
              errors.name ? 'border-red-400' : 'border-gray-300'
            }`}
            onChangeText={(text) => setValue('name', text)}
            {...register('name')}
          />
          {errors.name && <Text className="text-sm text-red-400 mt-1">{errors.name.message}</Text>}

          <Text>Prénom:</Text>
          <TextInput
            placeholder="Votre prénom"
            className={`bg-white text-black w-full p-3 border rounded-lg ${
              errors.prenom ? 'border-red-400' : 'border-gray-300'
            }`}
            onChangeText={(text) => setValue('prenom', text)}
            {...register('prenom')}
          />
          {errors.prenom && <Text className="text-sm text-red-400 mt-1">{errors.prenom.message}</Text>}

          <Text>Email:</Text>
          <TextInput
            placeholder="Votre e-mail"
            className={`bg-white text-black w-full p-3 border rounded-lg ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            }`}
            autoCapitalize="none"
            onChangeText={(text) => setValue('email', text)}
            {...register('email')}
          />
          {errors.email && <Text className="text-sm text-red-400 mt-1">{errors.email.message}</Text>}

          <Text>Mot de passe:</Text>
          <TextInput
            placeholder="Votre mot de passe"
            secureTextEntry
            className={`bg-white text-black w-full p-3 border rounded-lg ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            }`}
            onChangeText={(text) => setValue('password', text)}
            {...register('password')}
          />
          {errors.password && <Text className="text-sm text-red-400 mt-1">{errors.password.message}</Text>}

          <Text>Confirmer le mot de passe:</Text>
          <TextInput
            placeholder="Confirmez votre mot de passe"
            secureTextEntry
            className={`bg-white text-black w-full p-3 border rounded-lg ${
              errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
            }`}
            onChangeText={(text) => setValue('confirmPassword', text)}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <Text className="text-sm text-red-400 mt-1">{errors.confirmPassword.message}</Text>}

          <TouchableOpacity
            className="bg-green-500 p-3 rounded mt-3"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-center font-bold">S’inscrire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-blue-500 text-center">Déjà un compte ? Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
