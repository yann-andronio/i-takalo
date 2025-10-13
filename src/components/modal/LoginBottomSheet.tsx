import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface LoginBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  bottomSheetTranslate: Animated.Value;
  backdropOpacity: Animated.Value;
  navigation: any;
}

const LoginBottomSheet: React.FC<LoginBottomSheetProps> = ({
  visible,
  onClose,
  bottomSheetTranslate,
  backdropOpacity,
  navigation,
}) => {
  const { height } = Dimensions.get('window');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: bottomSheetTranslate }],
            },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.handleBar} />

          <Text style={styles.bottomSheetTitle}>Se connecter à iTakalo</Text>

          {/* Google Login */}
          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={{ uri: 'https://www.google.com/favicon.ico' }}
              style={styles.socialIcon}
            />
            <Text style={styles.googleButtonText}>Continuer avec Google</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.divider} />
          </View>

          {/* Facebook Login */}
          <TouchableOpacity style={styles.facebookButton}>
            <View style={styles.facebookIconContainer}>
              <Text style={styles.facebookIcon}>f</Text>
            </View>
            <Text style={styles.facebookButtonText}>Continuer avec Facebook</Text>
          </TouchableOpacity>

          {/* Email Login */}
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.connexionEmail}>
              Continuer avec une adresse e-mail
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
    position: 'absolute',
    top: -10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 24,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 22,
    color: '#666',
    fontWeight: '300',
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 35,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 12,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 30,
  },
  facebookIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  facebookIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  facebookButtonText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  connexionEmail: {
    color: '#007AFF',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginBottomSheet;
