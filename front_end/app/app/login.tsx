import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../src/constants/theme';
import { login as loginApi } from '../src/api/client';
import { useAuth } from '../src/context/AuthContext';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import FormInput from '../src/components/common/FormInput';
import PremiumButton from '../src/components/common/PremiumButton';

const loginSchema = z.object({
  username: z.string().min(4, 'MSSV không hợp lệ (quá ngắn)'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên')
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.detail || "Đăng nhập thất bại. Vui lòng thử lại.";
      Alert.alert("Thông báo", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, '#3A0CA3']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <ShieldCheck size={60} color={COLORS.white} />
            </View>
            <Text style={styles.title}>DYUS</Text>
            <Text style={styles.subtitle}>Hệ thống Số hóa Đoàn - Hội</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Đăng nhập</Text>
            <Text style={styles.loginSub}>Sử dụng mã số sinh viên (MSSV) của bạn</Text>

            {/* Username Input */}
            <FormInput 
              control={control}
              name="username"
              placeholder="Mã số sinh viên (MSSV)"
              leftIcon={<User size={20} color={COLORS.primary} />}
            />

            {/* Password Input */}
            <FormInput 
              control={control}
              name="password"
              placeholder="Mật khẩu"
              secureTextEntry={!showPassword}
              leftIcon={<Lock size={20} color={COLORS.primary} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} color={COLORS.border} /> : <Eye size={20} color={COLORS.border} />}
                </TouchableOpacity>
              }
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <PremiumButton 
              title="Vào hệ thống"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              icon={<ArrowRight size={20} color={COLORS.white} />}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Bằng việc đăng nhập, bạn đồng ý với</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Điều khoản & Chính sách bảo mật</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 25,
    ...SHADOWS.medium,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  loginSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 25,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 15,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  linkText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 5,
  }
});

export default LoginScreen;
