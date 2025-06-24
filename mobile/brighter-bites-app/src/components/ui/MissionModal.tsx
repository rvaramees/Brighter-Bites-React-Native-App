import React, { ReactNode } from 'react';
import { View, Text, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MissionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const MissionModal = ({ visible, onClose, title, children }: MissionModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <SafeAreaView className="w-11/12 max-w-sm bg-cyan-50 rounded-3xl shadow-2xl p-6">
          
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Ionicons name="rocket-outline" size={32} color="#0891B2" />
            <Text className="text-2xl font-extrabold text-cyan-700">{title}</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close-circle" size={32} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Content Area */}
          <View className="my-4">
            {children}
          </View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-cyan-500 py-4 rounded-full items-center shadow-lg"
          >
            <Text className="text-white text-xl font-bold">Let's Go!</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default MissionModal;