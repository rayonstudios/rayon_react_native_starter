import React from "react";
import { View } from "react-native";
import { Modal, Portal, IconButton } from "react-native-paper";
import { useThemeColor } from "@/lib/hooks/useThemeColor";

type CustomModalProps = {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onDismiss,
  children,
}) => {
  const background = useThemeColor({}, "background") as string;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        {/* Container moved inside Modal so we can use className */}
        <View
          className="p-[10px] my-[40px] mx-[10px] rounded-lg flex-1 h-full"
          style={{ backgroundColor: background }}
        >
          {/* Header */}
          <View className="flex-row justify-end">
            <IconButton icon="close" size={24} onPress={onDismiss} />
          </View>

          {/* Content */}
          {children}
        </View>
      </Modal>
    </Portal>
  );
};

export default CustomModal;
