import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeftIcon,
  CameraIcon,
  PaperclipIcon,
  SmileyIcon,
  PaperPlaneRightIcon,
} from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';
import { ProductData } from '../data/ProductData';
import { UserData } from '../data/UserData';
import { textinput } from '../styles/Styles';

interface MessageI {
  id: string;
  text: string;
  isCurrentUser: boolean;
}

const conversationData: MessageI[] = [
  {
    id: '1',
    text: 'Salama Misaoitra anao nifandray tamin’i Clara Boutique! Liana amin’ny pataloaha entana navoakana’y ve ianao?',
    isCurrentUser: false,
  },
  {
    id: '2',
    text: 'Salama Clara, eny hitako tao amin’ny pejinao ny pataloaha mainty. Mbola misy ve izy ireo?',
    isCurrentUser: true,
  },
  {
    id: '3',
    text: 'Eny, tanteraka! Mbola manana habe M, L ary XL izahay. Modely tena manara-penitra tokoa amin’izao fotoana izao, tapa-tongotra mahitsy miaraka amin’ny paosy.',
    isCurrentUser: false,
  },
  {
    id: '4',
    text: 'Hmm, toa tsara, fa tsy azoko antoka ny momba ny fitaovana. denim ve sa maivana?',
    isCurrentUser: true,
  },
  {
    id: '7',
    text: 'Ok, mahaliana... Fa matahotra aho fa mety',
    isCurrentUser: true,
  },
  {
    id: '8',
    text: 'poinse ve sa ahona ee',
    isCurrentUser: true,
  },
];

const interlocutorData = UserData.find(u => u.id === '3');
const productDetails = ProductData.find(p => p.userId === '3');

export default function ConversationScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<MessageI[]>(conversationData);
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState(40); 

  const renderMessage = ({ item }: { item: MessageI }) => {
    const isCurrentUser = item.isCurrentUser;
    const messageBubbleClass = isCurrentUser ? 'bg-[#FEF094] rounded-t-xl rounded-bl-xl ml-auto' : 'bg-[#03233A] rounded-t-xl rounded-br-xl mr-auto';
    const messageTextClass = isCurrentUser ? 'text-[#03233A]' : 'text-white';
    const avatar = isCurrentUser ? UserData.find(u => u.id === '1')?.profileImage : interlocutorData?.profileImage;
    return (
      <View className="flex-row my-1 items-end">
        {!isCurrentUser && avatar && (
          <Image source={avatar} className="w-8 h-8 rounded-full mr-2" />
        )}
        <View className={`p-3 max-w-[75%] ${messageBubbleClass}`}>
          <Text className={messageTextClass}>{item.text}</Text>
        </View>
        {isCurrentUser && avatar && (
          <Image source={avatar} className="w-8 h-8 rounded-full ml-2" />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center gap-7">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full bg-gray-100"
          >
            <ArrowLeftIcon size={24} color="black" weight="bold" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            {interlocutorData && (
              <Image
                source={interlocutorData.profileImage}
                className="w-10 h-10 rounded-full ml-2"
              />
            )}
            <Text className="text-lg font-bold ml-3 text-[#03233A]">
              {interlocutorData?.username || 'Utilisateur'}
            </Text>
          </View>
        </View>
      </View>

      {/* card little info produit */}
      <View className="flex-row items-center justify-between p-4 m-4 rounded-xl border border-gray-200">
        {productDetails && (
          <Image
            source={productDetails.image}
            className="w-16 h-16 rounded-lg mr-3"
          />
        )}
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-800">
            {productDetails?.titre || 'Article'}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            {productDetails?.price || 'Ar 0'}
          </Text>
        </View>
        <TouchableOpacity className="py-2 px-4 rounded-full bg-[#03233A]">
          <Text className="text-white font-semibold">Acheter</Text>
        </TouchableOpacity>
      </View>

      {/* message*/}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        className="px-4"
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      {/*  clavier*/}
      <KeyboardAvoidingView keyboardVerticalOffset={80}>
        <View className="flex-row items-end p-4 bg-white justify-center border-t border-gray-100">

          <View className="flex-row items-end gap-2 mr-2">
            <TouchableOpacity>
              <PaperclipIcon size={24} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity>
              <CameraIcon size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <View className={`flex-row flex-1  items-end  px-4 w-full  rounded-xl bg-gray-100 text-black`}>
            <TextInput
              placeholder="Écrire un message..."
              placeholderTextColor="#6B7280"
              value={inputText}
              onChangeText={setInputText}
              multiline
              onContentSizeChange={e =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              className={` flex-1  text-base   text-gray-800 min-h-[40px]  max-h-[120px]  text-top`}
              style={{ height: inputHeight }}
            />
            <TouchableOpacity className="ml-2 self-end pb-1">
              <SmileyIcon size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="ml-2 p-2 bg-[#03233A] rounded-full self-end">
            <PaperPlaneRightIcon size={19} color="white" weight="bold" />
          </TouchableOpacity>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
