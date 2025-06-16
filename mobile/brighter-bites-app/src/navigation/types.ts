// src/navigation/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Intro: undefined; // No params expected for the Intro screen
  Auth: undefined;  // No params for the Auth screen
  // ... other screens like Home, Game, etc.
};

// This gives us type-safety for our screen props
export type IntroScreenProps = NativeStackScreenProps<RootStackParamList, 'Intro'>;
export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;