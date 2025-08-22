import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginScreenProps {
  navigation: any;
}

const ValidationSchema = yup.object({
  email: yup.string().email('Email invalide').required('Veuillez entrer votre email'),
  password: yup.string().min(6, 'Au moins 6 caractères').required('Mot de passe requis'),
});

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: yupResolver(ValidationSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Login:', data);
    login(data.email, data.password);
    reset();
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
        <View>
          <Text className="text-2xl font-bold mb-5">Se connecter</Text>

          <Text>Email:</Text>
          <TextInput
            placeholder="Votre e-mail"
            className={`bg-white text-black w-full p-3 border rounded-lg ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            }`}
            autoCapitalize="none"
            onChangeText={(value) => setValue('email', value)}
            {...register('email')}
          />
          {errors.email && (
            <Text className="text-sm text-red-400 mt-1">{errors.email.message}</Text>
          )}

          <Text>Mot de passe:</Text>
          <TextInput
            placeholder="Votre mot de passe"
            secureTextEntry
            className={`bg-white text-black w-full p-3 border rounded-lg ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            }`}
            onChangeText={(value) => setValue('password', value)}
            {...register('password')}
          />
          {errors.password && (
            <Text className="text-sm text-red-400 mt-1">{errors.password.message}</Text>
          )}

          <TouchableOpacity
            className="bg-blue-500 p-3 rounded mt-3"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-center font-bold">Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-blue-500 text-center">Pas encore de compte ? S’inscrire</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
