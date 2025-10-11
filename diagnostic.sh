#!/bin/bash
# Script de diagnostic pour DEVELOPER_ERROR Google Sign-In

echo "🔍 DIAGNOSTIC GOOGLE SIGN-IN - DEVELOPER_ERROR"
echo "================================================"
echo ""

# 1. Package Name
echo "📦 1. PACKAGE NAME"
echo "-------------------"
PACKAGE=$(grep -oP 'package="\K[^"]+' android/app/src/main/AndroidManifest.xml 2>/dev/null)
if [ -z "$PACKAGE" ]; then
    PACKAGE=$(grep -oP 'namespace\s*=\s*"\K[^"]+' android/app/build.gradle 2>/dev/null)
fi
echo "Package trouvé: $PACKAGE"
echo "➡️  Ce package doit être EXACTEMENT celui dans Google Cloud Console"
echo ""

# 2. SHA-1 Debug
echo "🔑 2. SHA-1 DEBUG KEYSTORE"
echo "-------------------"
SHA1=$(keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep -oP 'SHA1: \K[A-F0-9:]+')
if [ -z "$SHA1" ]; then
    echo "❌ Keystore debug introuvable à ~/.android/debug.keystore"
    echo "Création du keystore..."
    keytool -genkey -v -keystore ~/.android/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
    SHA1=$(keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep -oP 'SHA1: \K[A-F0-9:]+')
fi
echo "SHA-1 trouvé: $SHA1"
echo "➡️  Ce SHA-1 doit être dans votre OAuth Android Client"
echo ""

# 3. Vérifier le Web Client ID dans le code
echo "🌐 3. WEB CLIENT ID DANS LE CODE"
echo "-------------------"
WEB_CLIENT=$(grep -oP "GOOGLE_WEB_CLIENT_ID\s*=\s*['\"]\\K[^'\""]+" App.tsx 2>/dev/null || grep -oP "GOOGLE_WEB_CLIENT_ID\s*=\s*['\"]\\K[^'\""]+" src/App.tsx 2>/dev/null)
if [ -z "$WEB_CLIENT" ]; then
    echo "⚠️  Impossible de trouver GOOGLE_WEB_CLIENT_ID dans App.tsx"
    echo "Cherchez manuellement dans votre fichier App.tsx"
else
    echo "Web Client ID trouvé: $WEB_CLIENT"
    if [[ $WEB_CLIENT == *.apps.googleusercontent.com ]]; then
        echo "✅ Format correct (.apps.googleusercontent.com)"
    else
        echo "❌ Format incorrect - doit se terminer par .apps.googleusercontent.com"
    fi
fi
echo ""

# 4. Vérifier gradle
echo "📱 4. CONFIGURATION GRADLE"
echo "-------------------"
if grep -q "googlePlayServicesAuthVersion" android/build.gradle; then
    echo "✅ googlePlayServicesAuthVersion trouvé dans android/build.gradle"
else
    echo "❌ googlePlayServicesAuthVersion manquant dans android/build.gradle"
fi

if grep -q "play-services-auth" android/app/build.gradle; then
    echo "✅ play-services-auth trouvé dans android/app/build.gradle"
else
    echo "❌ play-services-auth manquant dans android/app/build.gradle"
fi
echo ""

# 5. Résumé
echo "📋 RÉSUMÉ - À COPIER DANS GOOGLE CLOUD CONSOLE"
echo "================================================"
echo ""
echo "OAuth Android Client:"
echo "  Package name: $PACKAGE"
echo "  SHA-1: $SHA1"
echo ""
echo "OAuth Web Client:"
echo "  Type: Web application"
echo "  (Pas de package, pas de SHA-1)"
echo ""
echo "Dans App.tsx, utilisez le CLIENT ID du Web Client (pas Android):"
echo "  const GOOGLE_WEB_CLIENT_ID = 'xxxxx.apps.googleusercontent.com';"
echo ""

# 6. Instructions suivantes
echo "🔧 ACTIONS À FAIRE:"
echo "================================================"
echo ""
echo "1. Allez sur https://console.cloud.google.com/"
echo "2. APIs & Services → Credentials"
echo ""
echo "3. Vérifiez votre OAuth Android Client:"
echo "   - Package name doit être: $PACKAGE"
echo "   - SHA-1 doit être: $SHA1"
echo ""
echo "4. Vérifiez que vous avez un OAuth Web Client"
echo "   - Type: Web application"
echo "   - Copiez son Client ID"
echo ""
echo "5. Dans App.tsx, utilisez le Web Client ID (pas l'Android Client ID)"
echo ""
echo "6. Rebuild complet:"
echo "   cd android && ./gradlew clean && cd .."
echo "   npm run android"
echo ""
