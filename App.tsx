import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css'; // NativeWind
import { LogBox, View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { ProductProvider } from './src/context/ProductContext';
import { UserProvider } from './src/context/UserContext';
import Toast from 'react-native-toast-message';
import codePush from '@revopush/react-native-code-push';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { PaperProvider } from 'react-native-paper';
import { ScrollProvider } from './src/context/ScrollContext';

// Masque le warning de SafeAreaView
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

const App: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<{
    receivedBytes: number;
    totalBytes: number;
  } | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const GOOGLE_WEB_CLIENT_ID = '82290075303-99d1t00h5nfc82af5fs8kf6dlm7vajlc.apps.googleusercontent.com';
  
  useEffect(() => {
    // Vérifier les mises à jour au démarrage
    syncCodePush();

    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);


  const syncCodePush = () => {
    codePush.sync(
      {
        installMode: codePush.InstallMode.ON_NEXT_RESTART,
        mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: {
          title: 'Mise à jour disponible',
          optionalUpdateMessage: 'Une nouvelle version est disponible. Voulez-vous la télécharger ?',
          optionalIgnoreButtonLabel: 'Plus tard',
          optionalInstallButtonLabel: 'Installer',
          mandatoryUpdateMessage: 'Une mise à jour importante est requise.',
          mandatoryContinueButtonLabel: 'Continuer',
        },
      },
      (status) => {
        switch (status) {
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            setSyncStatus('Vérification des mises à jour...');
            setShowUpdateModal(true);
            break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            setSyncStatus('Téléchargement en cours...');
            setShowUpdateModal(true);
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            setSyncStatus('Installation de la mise à jour...');
            break;
          case codePush.SyncStatus.UP_TO_DATE:
            setSyncStatus('');
            setShowUpdateModal(false);
            setDownloadProgress(null);
            break;
          case codePush.SyncStatus.UPDATE_INSTALLED:
            setSyncStatus('Mise à jour installée ! Redémarrage...');
            setTimeout(() => {
              setShowUpdateModal(false);
            }, 1500);
            break;
          case codePush.SyncStatus.UNKNOWN_ERROR:
            setSyncStatus('');
            setShowUpdateModal(false);
            setDownloadProgress(null);
            break;
        }
      },
      (progress) => {
        if (progress) {
          setDownloadProgress(progress);
        }
      }
    );
  };

  const getProgressPercentage = () => {
    if (!downloadProgress) return 0;
    return Math.round((downloadProgress.receivedBytes / downloadProgress.totalBytes) * 100);
  };

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider> 
            <ScrollProvider>
      <AuthProvider>
        <ProductProvider>
          <UserProvider>
            <AppNavigator />
            <Toast />

            {/* Modal de progression des mises à jour */}
            <Modal
              visible={showUpdateModal}
              transparent
              animationType="fade"
              statusBarTranslucent
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>iTakalo</Text>
                  <Text style={styles.syncMessage}>{syncStatus}</Text>

                  {downloadProgress && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${getProgressPercentage()}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {getProgressPercentage()}%
                      </Text>
                      <Text style={styles.progressDetails}>
                        {formatBytes(downloadProgress.receivedBytes)} MB /{' '}
                        {formatBytes(downloadProgress.totalBytes)} MB
                      </Text>
                    </View>
                  )}

                  {syncStatus.includes('Vérification') && (
                    <ActivityIndicator
                      size="large"
                      color="#10B981"
                      style={styles.spinner}
                    />
                  )}
                </View>
              </View>
            </Modal>
          </UserProvider>
        </ProductProvider>
      </AuthProvider>
      </ScrollProvider>
        </PaperProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 12,
  },
  syncMessage: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#374151',
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    color: '#10B981',
  },
  progressDetails: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  spinner: {
    marginTop: 16,
  },
});

// Configuration CodePush
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
};

export default codePush(codePushOptions)(App);