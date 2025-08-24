import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView, // <-- Importez KeyboardAvoidingView
  ScrollView, // <-- Importez ScrollView
  Platform, // <-- Utile pour les ajustements par plateforme
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { stylebtn, textinput } from '../styles/Styles';
import { EyeIcon, EyeSlashIcon } from 'phosphor-react-native';

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
    login(data.email, data.password);
    reset();
  };
    const [showPassword, setShowPassword] = useState(false);

  return (
    <ImageBackground
      source={require('../assets/images/LoginScreenImage/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Ajuste le comportement selon la plateforme
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-t-3xl p-6">
            <View className="items-center mb-5 ">
              <Image
                source={require('../assets/images/LoginScreenImage/Communication.png')}
                className="w-50 h-50"
                resizeMode="contain"
              />
            </View>

            <Text className="text-4xl font-bold mb-4 text-center">Tongasoa !</Text>
            <Text className="text-xl mb-8 text-center">
              Nous vous souhaitons la bienvenue sur notre plateforme i-Takalo
            </Text>

            <View className="mb-4">
              <TextInput
                placeholder="Votre e-mail"
                placeholderTextColor="#6B7280"       
                className={` ${textinput} ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                autoCapitalize="none"
                onChangeText={value => setValue('email', value)}
                {...register('email')}
              />
              {errors.email && <Text className="text-sm text-red-400 mt-1">{errors.email.message}</Text>}
            </View>

            <View className="mb-4 relative">
              <TextInput
                placeholder="Mot de passe"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                className={`${textinput} pr-12  ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                onChangeText={text => setValue('password', text)}
                {...register('password')}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon size={24} /> : <EyeIcon size={24} />}
              </TouchableOpacity>
              {errors.password && <Text className="text-sm text-red-400 mt-1">{errors.password.message}</Text>}
            </View>

            <TouchableOpacity className={stylebtn} onPress={handleSubmit(onSubmit)}>
              <Text className="text-center font-bold text-lg">Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-6 items-center">
              <Text>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center gap-5 mt-10">
              <TouchableOpacity className="flex-1 flex-row justify-center gap-3 items-center border p-2 rounded-full">
                <Image
                  source={require('../assets/images/LoginScreenImage/Google.png')}
                  className="w-9 h-9"
                  resizeMode="contain"
                />
                <Text>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row justify-center gap-3 items-center border p-2 rounded-full">
                <Image
                  source={require('../assets/images/LoginScreenImage/Facebook.png')}
                  className="w-9 h-9"
                  resizeMode="contain"
                />
                <Text>Facebook</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="mt-6" onPress={() => navigation.navigate('Register')}>
              <Text className="text-center font-bold text-colortextbtn mb-5">S’inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;