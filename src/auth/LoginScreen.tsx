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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
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
  const { login, loginWithGoogle, loading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: yupResolver(ValidationSchema),
  });

  // Connexion Email/Password
  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      reset();
      Alert.alert('Succès', 'Connexion réussie ! 🎉');
    } else {
      Alert.alert('Erreur', 'Identifiants invalides');
    }
  };

  // Connexion avec Google
  const handleGoogleSignIn = async () => {
    const success = await loginWithGoogle();
    if (success) {
      Alert.alert('Succès', 'Connexion avec Google réussie ! 🎉');
    } else {
      Alert.alert('Erreur', 'Échec de la connexion avec Google');
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
                source={require('../assets/images/LoginScreenImage/Communication.png')}
                className="w-50 h-50"
                resizeMode="contain"
              />
            </View>

            <Text className="text-4xl font-bold mb-4 text-center">Tongasoa !</Text>
            <Text className="text-xl mb-8 text-center">
              Nous vous souhaitons la bienvenue sur notre plateforme i-Takalo
            </Text>

            {/* Formulaire Email/Password */}
            <View className="mb-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Votre e-mail"
                    placeholderTextColor="#6B7280"
                    className={`${textinput} ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    editable={!loading}
                  />
                )}
              />
              {errors.email && <Text className="text-sm text-red-400 mt-1">{errors.email.message}</Text>}
            </View>

            <View className="mb-4 relative">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Mot de passe"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showPassword}
                    className={`${textinput} pr-12 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                    value={value}
                    onChangeText={onChange}
                    editable={!loading}
                  />
                )}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashIcon size={24} /> : <EyeIcon size={24} />}
              </TouchableOpacity>
              {errors.password && <Text className="text-sm text-red-400 mt-1">{errors.password.message}</Text>}
            </View>

            {/* Bouton Se connecter */}
            <TouchableOpacity className={stylebtn} onPress={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-center font-bold text-lg text-white">Se connecter</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity className="mt-6 items-center">
              <Text>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            {/* Divider OU */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">OU</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Boutons Google & Facebook */}
            <View className="flex-row justify-center gap-5">
              <TouchableOpacity
                className="flex-1 flex-row justify-center gap-3 items-center border border-gray-300 p-3 rounded-full"
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <Image
                  source={require('../assets/images/LoginScreenImage/Google.png')}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="font-medium">Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row justify-center gap-3 items-center border border-gray-300 p-3 rounded-full"
                disabled={loading}
              >
                <Image
                  source={require('../assets/images/LoginScreenImage/Facebook.png')}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="font-medium">Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Bouton S'inscrire */}
            <TouchableOpacity className="mt-6" onPress={() => navigation.navigate('Register')}>
              <Text className="text-center font-bold text-colortextbtn mb-5">S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;