import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Zap, ZapOff, AlertCircle, Star, MessageSquare } from 'lucide-react-native';
import { getUserRegistrations, checkInSecure, submitFeedback } from '../src/api/client';
import { useAuth } from '../src/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import SuccessAnimation from '../src/components/SuccessAnimation';
import { COLORS, SHADOWS } from '../src/constants/theme';
import GlassCard from '../src/components/common/GlassCard';
import PremiumButton from '../src/components/common/PremiumButton';

const { width } = Dimensions.get('window');

const ScanQRScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('Mã QR không hợp lệ');
  
  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  const router = useRouter();

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: 'black' }} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Chúng tôi cần quyền truy cập Camera để quét mã QR.</Text>
        <PremiumButton 
          title="Cấp quyền ngay"
          onPress={requestPermission}
          style={{ width: 200 }}
        />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !user) return;
    setScanned(true);
    
    try {
      const qrText = data.trim();
      let eventId = qrText;
      if (qrText.includes('|')) {
        eventId = qrText.split('|')[0];
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(eventId)) {
        throw new Error("Mã QR không đúng định dạng bảo mật.");
      }

      const myEvents = await getUserRegistrations(user.id);
      const registration = myEvents.find((reg: any) => reg.id === eventId); 

      if (!registration) {
        throw new Error("Bạn chưa đăng ký tham gia sự kiện này.");
      }

      await checkInSecure(registration.registration_id, qrText);

      // Invalidate queries so that the user's attended list and profile are updated immediately
      queryClient.invalidateQueries({ queryKey: ['userRegistrations', user.id] });
      queryClient.invalidateQueries({ queryKey: ['profileStats', user.id] });

      setCurrentEventId(eventId);
      setStatus('success');
      
      setTimeout(() => {
        setShowFeedback(true);
      }, 1800);
      
    } catch (error: any) {
      console.error('Scan check-in error:', error);
      const errorMsgText = error.response?.data?.detail || error.message || "Lỗi hệ thống khi điểm danh.";
      setErrorMsg(errorMsgText);
      setStatus('error');
      setTimeout(() => {
        setScanned(false);
        setStatus('idle');
      }, 4000);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!user || !currentEventId) return;
    setSubmitting(true);
    try {
      await submitFeedback(currentEventId, rating, comment, user.id);
      Alert.alert("Cảm ơn!", "Phản hồi của bạn đã được ghi nhận.");
      router.back();
    } catch (error) {
      console.error('Submit feedback error:', error);
      Alert.alert("Lỗi", "Không thể gửi phản hồi lúc này.");
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        enableTorch={flash}
      />

      {/* UI Overlay */}
      <View style={styles.overlay}>
        <View style={styles.topSection}>
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
              <X size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quét mã điểm danh</Text>
            <TouchableOpacity onPress={() => setFlash(!flash)} style={styles.circleBtn}>
              {flash ? <Zap size={22} color="#FFD700" fill="#FFD700" /> : <ZapOff size={22} color={COLORS.white} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.middleSection}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {status === 'success' && (
              <GlassCard style={styles.resultGlass} opacity={0.98}>
                <SuccessAnimation message="Điểm danh xong!" />
              </GlassCard>
            )}
            {status === 'error' && (
              <GlassCard style={styles.resultGlass} opacity={0.98}>
                <AlertCircle size={60} color={COLORS.error} />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </GlassCard>
            )}
          </View>
          <View style={styles.sideOverlay} />
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.hintText}>Đưa mã QR của sự kiện vào khung hình</Text>
        </View>
      </View>

      <Modal visible={showFeedback} transparent={true} animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassCard style={styles.modalContent} opacity={1}>
            <Text style={styles.modalTitle}>Sự kiện thế nào?</Text>
            <Text style={styles.modalSub}>Hãy giúp chúng tôi cải thiện bằng cách để lại phản hồi</Text>
            
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star 
                    size={32} 
                    color={star <= rating ? "#FFD700" : COLORS.border} 
                    fill={star <= rating ? "#FFD700" : "transparent"} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputContainer}>
              <MessageSquare size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.commentInput}
                placeholder="Lời nhắn cho Ban Tổ Chức..."
                multiline
                numberOfLines={3}
                value={comment}
                onChangeText={setComment}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <PremiumButton 
              title="Gửi phản hồi"
              onPress={handleFeedbackSubmit}
              loading={submitting}
              style={styles.submitBtn}
            />

            <TouchableOpacity onPress={() => router.back()} style={styles.skipBtn}>
              <Text style={styles.skipText}>Bỏ qua & Đóng</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  middleSection: {
    flexDirection: 'row',
    height: width * 0.72,
  },
  bottomSection: {
    flex: 1.2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    paddingTop: 30,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scanFrame: {
    width: width * 0.72,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  corner: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderColor: COLORS.primary,
    borderWidth: 5,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 20,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 20,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 20,
  },
  hintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultGlass: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 0,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.error,
    marginTop: 20,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  modalContent: {
    width: '100%',
    padding: 30,
    alignItems: 'center',
    borderRadius: 35,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginTop: 5,
  },
  commentInput: {
    flex: 1,
    marginLeft: 10,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: COLORS.text,
  },
  submitBtn: {
    width: '100%',
    marginBottom: 15,
  },
  skipBtn: {
    padding: 5,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
    lineHeight: 24,
  }
});

export default ScanQRScreen;
