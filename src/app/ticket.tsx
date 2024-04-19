import { useState } from "react";

import { StatusBar, View, Text, ScrollView, TouchableOpacity, Alert, Modal, Share } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Redirect } from "expo-router";

import { useBadgeStorage } from "@/storage/badge-storage";

import { colors } from "@/styles/colors";

import { Header } from "@/components/header";
import { Credential } from "@/components/credential";
import { Button } from "@/components/button";
import { QRCode } from "@/components/qrcode";

export default function Ticket(){
    const [expandQRCode, setExpandQRCode] = useState(false);

    const badgeStorage = useBadgeStorage()

    async function handleShare() {
        try{
            if(badgeStorage.data?.checkInURL){
                await Share.share({
                    message: badgeStorage.data.checkInURL,
                })
            }
        }catch(error){
            console.log(error);
            Alert.alert("Compartilhar", "Não foi possível compartilhar");
        }
    }

    async function handleSelectImage(){
        try{
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,4],
            })

            if(result.assets){
                badgeStorage.updateAvatar(result.assets[0].uri)
            }

        }catch(error){
            console.log(error)
            Alert.alert("Foto", "Não foi possível selecionar a imagem")
        }
    }

    if(!badgeStorage.data?.checkInURL){
        return <Redirect href="/" />
    }

    return(
        <View className="flex-1 bg-green-500">
            <StatusBar barStyle="light-content" />
            <Header title="Minha Credencial" />
            <ScrollView 
                className="-mt-28 -z-10" 
                contentContainerClassName="px-8 pb-8"
                showsVerticalScrollIndicator={false}
            >
                <Credential 
                    data={badgeStorage.data}
                    onChangeAvatar={handleSelectImage} 
                    onExpandQRCode={() => setExpandQRCode(true)}
                />

                <FontAwesome 
                    name="angle-double-down" 
                    size={24} 
                    color={colors.gray[300]} 
                    className="self-center my-6"
                />

                <Text className="text-white font-bold text-2xl mt-4">
                    Compartilhar credencial
                </Text>
                
                <Text className="text-white font-regular text-base mt-1 mb-6">
                    Mostre ao mundo que você vai participar do evento {badgeStorage.data.eventTitle}!
                </Text>

                <Button title="Compartilhar" onPress={handleShare} />

                <TouchableOpacity 
                    activeOpacity={0.7} 
                    className="mt-10" 
                    onPress={() => badgeStorage.remove()}
                >
                    <Text className="text-base text-white font-bold text-center">Remover Ingresso</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={expandQRCode} statusBarTranslucent>
                <View className="flex-1 bg-green-500 items-center justify-center">
                    <TouchableOpacity 
                        activeOpacity={0.7} 
                        onPress={() => setExpandQRCode(false)}
                    >
                        <QRCode value="teste" size={250} />
                        <Text className="font-body text-orange-500 text-sm mt-10 text-center">
                            Fechar QRCode
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}