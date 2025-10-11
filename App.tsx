import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ⚠️ REMPLACEZ PAR VOTRE WEB CLIENT ID de Google Cloud Console
// const GOOGLE_WEB_CLIENT_ID = 'VOTRE_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_WEB_CLIENT_ID = '82290075303-99d1t00h5nfc82af5fs8kf6dlm7vajlc.apps.googleusercontent.com';

// ⚠️ REMPLACEZ PAR L'URL DE VOTRE API DJANGO
const API_URL = 'https://bridges-oaks-manually-cells.trycloudflare.com'; // Pour émulateur Android


const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Configuration de Google Sign-In
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    // Vérifier si l'utilisateur est déjà connecté
    checkIfLoggedIn();
  }, []);

  // Vérifier si un token existe
  const checkIfLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Erreur lors de la vérification:', error);
    }
  };

  // Connexion avec Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Vérifier si les services Google Play sont disponibles
      await GoogleSignin.hasPlayServices();
      
      // Obtenir les informations de l'utilisateur
      const userInfo = await GoogleSignin.signIn();
      
      console.log('✅ Google User Info:', userInfo);
      
      // Obtenir l'ID token
      const tokens = await GoogleSignin.getTokens();
      console.log('🔑 ID Token:', tokens.idToken);
      
      // Envoyer le token à votre backend Django
      const response = await axios.post(`${API_URL}/api/v1/auth/google/`, {
        token: tokens.idToken,
      });
      
      console.log('✅ Réponse du serveur:', response.data);
      
      // Sauvegarder le JWT token et les infos utilisateur
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.member));
      
      setUser(response.data.member);
      Alert.alert('Succès', 'Connexion avec Google réussie ! 🎉');
      
    } catch (error) {
      setLoading(false);
      handleGoogleSignInError(error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des erreurs Google Sign-In
  const handleGoogleSignInError = (error) => {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('❌ Connexion annulée');
      Alert.alert('Annulé', 'Connexion annulée');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('⏳ Connexion en cours...');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('❌ Play Services non disponible');
      Alert.alert('Erreur', 'Google Play Services non disponible');
    } else {
      console.error('❌ Erreur:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    }
  };

  // Connexion avec Email/Password
  const signInWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/api/v1/auth/login/`, {
        email: email,
        password: password,
      });
      
      console.log('✅ Connexion réussie:', response.data);
      
      // Sauvegarder le token
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.member));
      
      setUser(response.data.member);
      Alert.alert('Succès', 'Connexion réussie ! 🎉');
      
    } catch (error) {
      console.error('❌ Erreur de connexion:', error.response?.data || error.message);
      Alert.alert('Erreur', error.response?.data?.error || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      // Déconnexion de Google si connecté avec Google
      if (user?.is_google_user) {
        await GoogleSignin.signOut();
      }
      
      // Supprimer les données locales
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      setUser(null);
      setEmail('');
      setPassword('');
      
      Alert.alert('Déconnexion', 'Vous êtes déconnecté');
      
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error);
    }
  };

  // Si l'utilisateur est connecté
  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileContainer}>
            <Text style={styles.title}>✅ Connecté</Text>
            
            {user.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </Text>
              </View>
            )}
            
            <Text style={styles.name}>
              {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
            
            {user.is_google_user && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🔐 Google Account</Text>
              </View>
            )}
            
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>{user.id}</Text>
            </View>
            
            {user.username && (
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Username:</Text>
                <Text style={styles.infoValue}>{user.username}</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={signOut}>
              <Text style={styles.logoutButtonText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Page de connexion
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>🔐 Connexion</Text>
          <Text style={styles.subtitle}>Bienvenue ! Connectez-vous pour continuer</Text>
          
          {/* Bouton Google Sign-In */}
          <View style={styles.googleButtonContainer}>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={signInWithGoogle}
              disabled={loading}
            />
          </View>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>
          
          {/* Formulaire Email/Password */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={signInWithEmail}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4285F4" />
              <Text style={styles.loadingText}>Connexion en cours...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  googleButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loginButton: {
    backgroundColor: '#4285F4',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginVertical: 10,
  },
  badgeText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;