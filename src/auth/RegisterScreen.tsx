import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { stylebtn, textinput } from '../styles/Styles';
import { EyeIcon , EyeSlashIcon } from 'phosphor-react-native';

interface RegisterFormData {
  first_name: string;  // prénom
  last_name: string;   // nom
  email: string;
  password: string;
  confirmPassword: string; // uniquement pour validation front
}

const ValidationSchema = yup.object({
  first_name: yup.string().required('Veuillez entrer votre prénom'),
  last_name: yup.string().required('Veuillez entrer votre nom'),
  email: yup.string().email('Email invalide').required('Veuillez entrer votre email'),
  password: yup.string().min(6, 'Au moins 6 caractères').required('Mot de passe requis'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe doivent correspondre')
    .required('Veuillez confirmer votre mot de passe'),
});

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register: registerUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: yupResolver(ValidationSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const registerdataalefa = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      };
      await registerUser(registerdataalefa); // envoi au backend Django
      reset();
      navigation.replace("Login");
    } catch (error: any) {
      console.log("Erreur lors de l'inscription :", error);
      setServerError(
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.detail ||
        "Erreur inconnue"
      );
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/LoginScreenImage/background.png')}
      className="flex-1"
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-t-3xl p-6">
            <View className="items-center mb-5">
              <Image
                source={require('../assets/images/RegisterScreenImage/reg.png')}
                className="w-50 h-50"
                resizeMode="contain"
              />
            </View>

            <Text className="text-4xl font-bold mb-8 text-center">S’inscrire</Text>

            {serverError && <Text className="text-sm text-red-500 mb-3 text-center">{serverError}</Text>}

          

            {/* Nom */}
            <View className="mb-4">
              <TextInput
                placeholder="Nom"
                placeholderTextColor="#6B7280"
                className={`${textinput} ${errors.last_name ? 'border-red-400' : 'border-gray-200'}`}
                onChangeText={text => setValue('last_name', text)}
                {...register('last_name')}
              />
              {errors.last_name && <Text className="text-sm text-red-400 mt-1">{errors.last_name.message}</Text>}
            </View>

              {/* Prénom */}
            <View className="mb-4">
              <TextInput
                placeholder="Prénom"
                placeholderTextColor="#6B7280"
                className={`${textinput} ${errors.first_name ? 'border-red-400' : 'border-gray-200'}`}
                onChangeText={text => setValue('first_name', text)}
                {...register('first_name')}
              />
              {errors.first_name && <Text className="text-sm text-red-400 mt-1">{errors.first_name.message}</Text>}
            </View>

            {/* Email */}
            <View className="mb-4">
              <TextInput
                placeholder="Email"
                placeholderTextColor="#6B7280"
                autoCapitalize="none"
                className={`${textinput} ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                onChangeText={text => setValue('email', text)}
                {...register('email')}
              />
              {errors.email && <Text className="text-sm text-red-400 mt-1">{errors.email.message}</Text>}
            </View>

            {/* Mot de passe */}
            <View className="mb-4 relative">
              <TextInput
                placeholder="Mot de passe"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showPassword}
                className={`${textinput} pr-12 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
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

            {/* Confirmer mot de passe */}
            <View className="mb-6 relative">
              <TextInput
                placeholder="Confirmer mot de passe"
                placeholderTextColor="#6B7280"
                secureTextEntry={!showConfirmPassword}
                className={`${textinput} pr-12 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-200'}`}
                onChangeText={text => setValue('confirmPassword', text)}
                {...register('confirmPassword')}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeSlashIcon size={24} /> : <EyeIcon size={24} />}
              </TouchableOpacity>
              {errors.confirmPassword && <Text className="text-sm text-red-400 mt-1">{errors.confirmPassword.message}</Text>}
            </View>

            <TouchableOpacity className={stylebtn} onPress={handleSubmit(onSubmit)}>
              <Text className="text-center font-bold text-lg">S’inscrire</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center gap-5 mt-10">
              <TouchableOpacity className="flex-1 flex-row justify-center gap-3 items-center border px-4 py-2 rounded-full">
                <Image
                  source={require('../assets/images/LoginScreenImage/Google.png')}
                  className="w-9 h-9"
                  resizeMode="contain"
                />
                <Text>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row justify-center gap-3 items-center border px-4 py-2 rounded-full">
                <Image
                  source={require('../assets/images/LoginScreenImage/Facebook.png')}
                  className="w-9 h-9"
                  resizeMode="contain"
                />
                <Text>Facebook</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="mt-6" onPress={() => navigation.replace('Login')}>
              <Text className="text-center font-bold text-colortextbtn mb-5">Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default RegisterScreen;
