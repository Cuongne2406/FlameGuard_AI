import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { COLORS, SHADOWS } from '../../constants/theme';

interface FormInputProps {
  control: Control<any>;
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  style,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={[styles.container, style]}>
          <View style={[
            styles.inputWrapper, 
            error ? styles.inputError : styles.inputNormal,
            SHADOWS.light
          ]}>
            {leftIcon && <View style={styles.iconBox}>{leftIcon}</View>}
            <TextInput
              style={[
                styles.input,
                multiline && { height: numberOfLines * 25, textAlignVertical: 'top' }
              ]}
              placeholder={placeholder}
              placeholderTextColor={COLORS.textSecondary}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={numberOfLines}
            />
            {rightIcon && <View style={styles.iconBox}>{rightIcon}</View>}
          </View>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    height: 56,
  },
  inputNormal: {
    borderColor: '#E9ECEF',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  iconBox: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingRight: 15,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  }
});

export default FormInput;
