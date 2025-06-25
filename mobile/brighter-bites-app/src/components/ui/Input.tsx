import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

// This interface defines the props our custom component will accept.
// It includes all standard TextInputProps, plus our own custom props like `label` and `error`.
export interface InputProps extends TextInputProps {
  className?: string; // To allow passing additional NativeWind classes
  label?: string;
  error?: string;
}

/**
 * A custom, reusable TextInput component for the Brighter Bites app.
 *
 * This component standardizes the appearance of all text inputs,
 * ensures consistent styling, and fixes the iOS placeholder color issue
 * by providing a default `placeholderTextColor`.
 *
 * It's created using `React.forwardRef` to allow parent components
 * to get a reference to the underlying TextInput, which is useful for
 * focusing logic (e.g., moving from one field to the next).
 */
const Input = forwardRef<TextInput, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <View className="w-full mb-4">
        {/* Render the label only if it's provided */}
        {label && (
          <Text className="text-base font-semibold text-gray-700 mb-2 ml-1">
            {label}
          </Text>
        )}
        
        <TextInput
          // Forward the ref to the underlying TextInput
          ref={ref}
          
          // --- THE FIX IS HERE ---
          // We set a default, visible color for the placeholder text.
          // This color will be used on both iOS and Android.
          // #9CA3AF is Tailwind's gray-400, a great choice for placeholders.
          placeholderTextColor="#9CA3AF"
          
          // --- DEFAULT STYLES ---
          // These are the base styles for every input in the app.
          // We also include the `className` prop to allow for overrides and additions.
          className={`
            bg-white p-4 rounded-lg border text-base text-gray-900
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          
          // Spread the rest of the props (like value, onChangeText, etc.)
          {...props}
        />
        
        {/* Render the error message only if it exists */}
        {error && (
          <Text className="text-red-600 mt-1 ml-1">{error}</Text>
        )}
      </View>
    );
  }
);

export { Input };