import React, {  PropsWithChildren } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { paleta, paleta_colores } from "@/components/colores";

type Props = PropsWithChildren<{
    title:string | undefined,
  modalVisible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}>;

function SmallPopupModal ({children,modalVisible,setVisible,title}:Props) {
    return (

        <Modal 
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setVisible(false)}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Pressable 
                    onPress={() => setVisible(false)}
                    style={styles.closeButton}
                    >
                    <Ionicons name="close" size={24} color="#014f86" />
                    </Pressable>
                </View>
                <View>{children}</View>
                </View>
            </View>
        </Modal>
        
    )
}

const styles =StyleSheet.create({
modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: paleta.dark_aqua
  },
  closeButton: {
    padding: 8,
  },
})

export {SmallPopupModal}