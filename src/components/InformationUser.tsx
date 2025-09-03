import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StatusBar, Alert, ActivityIndicator,} from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { UserIcon, PencilSimpleIcon } from 'phosphor-react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfilStackNavigation } from '../screens/ProfileScreen';
import * as yup from 'yup';
import { stylebtn } from '../styles/Styles';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';
import API from '../api/Api';
import { UserContext } from '../context/UserContext';

export const ValidationSchema = yup.object().shape({
    first_name: yup.string().required('Le prénom est requis'),
    last_name: yup.string().required('Le nom est requis'),
    email: yup.string().email("L'e-mail est invalide").required("L'e-mail est requis"),
    telnumber: yup.string().nullable().defined(),
});

interface UpdateProfileFormData {
    first_name: string;
    last_name: string;
    email: string;
    telnumber: string | null;
}

interface FormFieldProps {
    label: string;
    name: keyof UpdateProfileFormData;
    control: any;
    errors: any;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const FormField = ({ label, name, control, errors, placeholder, keyboardType = 'default' }: FormFieldProps) => (
    <View className="mb-4">
        <Text className="text-gray-500 text-sm mb-1 ml-4">{label}</Text>
        <View className="bg-white flex-row items-center rounded-lg border border-gray-200  px-2 shadow-sm">
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        className="flex-1 text-base text-gray-800"
                        placeholder={placeholder}
                        placeholderTextColor={"#6B7280"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ?? ''}
                        keyboardType={keyboardType}
                    />
                )}
            />
            <PencilSimpleIcon size={20} color="gray" />
        </View>
        {errors[name] && <Text className="text-red-500 mt-1 ml-4 text-sm">{errors[name].message}</Text>}
    </View>
);

export default function InformationUser() {
    const { user, updateUser } = useContext(AuthContext);
    const {updateUserInList} = useContext(UserContext)
    const navigation = useNavigation<ProfilStackNavigation>();
    
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<UpdateProfileFormData>({
        resolver: yupResolver(ValidationSchema),
        defaultValues: {
            first_name: user?.first_name ?? '',
            last_name: user?.last_name ?? '',
            email: user?.email ?? '',
            telnumber: user?.telnumber ?? null,
        },
    });

    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: true,
            maxHeight: 400,
            maxWidth: 400,
        };

        launchImageLibrary(options, (response) => {
            if (response.assets && response.assets.length > 0) {
                const source = response.assets[0].uri;
                if (source) {
                    setSelectedImage(source);
                }
            }
        });
    };

    const handleUpdateProfile = async (data: UpdateProfileFormData) => {
        setLoading(true);

        // Crée une copie des valeurs du formulaire pour la comparaison
        const initialData = {
            first_name: user?.first_name ?? '',
            last_name: user?.last_name ?? '',
            email: user?.email ?? '',
            telnumber: user?.telnumber ?? null,
        };
        
        // Convertit les numéros de téléphone en chaînes pour la comparaison
        const currentTel = data.telnumber?.toString() || null;
        const initialTel = initialData.telnumber?.toString() || null;
    
        // Vérifie si une image a été modifiée et si les autres champs n'ont pas changé
        const noChanges = 
            !selectedImage && 
            data.first_name === initialData.first_name &&
            data.last_name === initialData.last_name &&
            data.email === initialData.email &&
            currentTel === initialTel;
        
        // Si aucune modification n'est détectée, affiche une alerte et arrête le processus
        if (noChanges) {
            Alert.alert("Information", "Aucune modification n'a été apportée.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();

            formData.append('first_name', data.first_name);
            formData.append('last_name', data.last_name);
            formData.append('email', data.email);
            if (data.telnumber !== null) {
                formData.append('telnumber', data.telnumber);
            }
            
            if (user?.type) {
                 formData.append('type', user.type);
            }

            // Si une nouvelle image a été sélectionnée, ajoutez-la au FormData
            if (selectedImage) {
                const filename = selectedImage.split('/').pop();
                const fileType = selectedImage.substring(selectedImage.lastIndexOf('.') + 1);

                formData.append('image', {
                    uri: selectedImage,
                    name: filename,
                    type: `image/${fileType}`,
                });
            }
            
            // Exécutez la requête PUT avec le FormData
            const response = await API.put(`/api/v1/members/${user?.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (updateUser) {
               // Met à jour l'utilisateur dans l'AuthContext
                updateUser(response.data);
            }

            if (updateUserInList) {
                // Met à jour l'utilisateur dans la liste du UserContext
                updateUserInList(response.data);
            }

            Alert.alert("Succès", "Votre profil a été mis à jour.");

        } catch (error: any) {
            console.log("Erreur de mise à jour du profil:");
            if (error.response) {
                console.log("Status de la requête:", error.response.status);
                console.log("Données de l'erreur:", error.response.data);
            } else if (error.request) {
                console.log("Requête sans réponse:", error.request);
            } else {
                console.log("Message d'erreur:", error.message);
            }
            
            Alert.alert("Erreur", "Impossible de mettre à jour le profil.");
        } finally {
            setLoading(false);
        }
    };

    const profileImageSource = selectedImage ? { uri: selectedImage } : (user?.image ? { uri: user.image } : null);
    const hasProfileImage = !!profileImageSource;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <ScrollView className="flex-1 px-6">
                <View className="items-center mb-8">
                    <View className="w-32 h-32 rounded-full border-4 border-gray-300 items-center justify-center shadow-md overflow-hidden">
                        {hasProfileImage ? (
                            <Image
                                source={profileImageSource}
                                className="w-full h-full rounded-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-full rounded-full bg-gray-200 items-center justify-center">
                                <UserIcon size={70} color="gray" weight="light" />
                            </View>
                        )}
                    </View>

                    <TouchableOpacity 
                        className="bg-[#FEF094] px-6 py-3 rounded-full mt-6 shadow-sm"
                        onPress={handleImagePicker}
                    >
                        <Text className="text-black font-semibold text-base">Modifier la photo</Text>
                    </TouchableOpacity>
                </View>

                <View className="bg-white rounded-xl shadow-md mb-8">
                    <FormField 
                        label="Prénom"
                        name="first_name"
                        control={control}
                        errors={errors}
                        placeholder="Entrez votre prénom"
                    />
                    <FormField 
                        label="Nom"
                        name="last_name"
                        control={control}
                        errors={errors}
                        placeholder="Entrez votre nom de famille"
                    />
                    <FormField 
                        label="Téléphone"
                        name="telnumber"
                        control={control}
                        errors={errors}
                        placeholder="Entrez votre numéro de téléphone"
                        keyboardType="phone-pad"
                    />
                    <FormField 
                        label="Email"
                        name="email"
                        control={control}
                        errors={errors}
                        placeholder="Entrez votre email"
                        keyboardType="email-address"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit(handleUpdateProfile)}
                    className={`${stylebtn} mb-8`}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-black text-lg font-bold">Enregistrer les modifications</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}