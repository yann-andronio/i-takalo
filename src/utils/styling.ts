import { Dimensions, PixelRatio } from "react-native";

// Récupération des dimensions de l'écran actuel
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Déterminer la plus petite et la plus grande dimension de l'écran
// Cela permet d'adapter les calculs à l'orientation (portrait ou paysage)
const [shortDimension, longDimension] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT] // Mode portrait
    : [SCREEN_HEIGHT, SCREEN_WIDTH]; // Mode paysage

// Dimensions de référence utilisées pour le design initial
const guidelineBaseWidth = 375; // Largeur de référence (ex: iPhone X)
const guidelineBaseHeight = 812; // Hauteur de référence

/**
 * Fonction pour redimensionner un élément proportionnellement à la largeur de l'écran.
 * Utile pour ajuster les largeurs, marges et tailles de texte.
 *
 * @param size - Taille de référence à ajuster
 * @returns Taille ajustée selon l'écran de l'utilisateur
 */
export const scale = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel((shortDimension / guidelineBaseWidth) * size)
  );

/**
 * Fonction pour redimensionner un élément proportionnellement à la hauteur de l'écran.
 * Utile pour ajuster les hauteurs et espacements verticaux.
 *
 * @param size - Taille de référence à ajuster
 * @returns Taille ajustée selon l'écran de l'utilisateur
 */
export const verticalScale = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel((longDimension / guidelineBaseHeight) * size)
  );
