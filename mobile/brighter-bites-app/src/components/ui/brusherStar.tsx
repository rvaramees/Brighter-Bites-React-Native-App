import { View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface BrusherStarsProps {
  isActive: boolean;
}

const BrusherStars = ({isActive}: BrusherStarsProps) => {
  if (isActive) {
    return (
    <View className='w-full h-20 bg-blue-500/0 items-center justify-end flex-row border border-blue-500/0'>
      <View className='w-5/6 h-3 bg-blue-500/50 rounded-lg border me-11'
      style={{
        position: 'absolute',
      }}
      ></View>
        <Ionicons className='me-20' name="star" size={42} color="orange" />
        <Ionicons className='me-20' name="star" size={42} color="orange" />
        <Ionicons className='me-8' name="star" size={42} color="orange" />

    </View>
  );
}
else{
    return (
    <View></View>
    );
}
}

export default BrusherStars;