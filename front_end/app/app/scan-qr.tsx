import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Zap, ZapOff, ShieldCheck, AlertCircle, Star } from 'lucide-react-native';
import { getUserRegistrations, updateRegistrationStatus, submitFeedback } from '../src/api/client';
import { useAuth } from '../src/context/AuthContext';
import SuccessAnimation from '../src/components/SuccessAnimation';
import { COLORS, SIZES, SHADOWS } from '../src/constants/theme';

const { width } = Dimensions.get('window');

const ScanQRScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
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
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Chúng tôi cần quyền truy cập Camera để quét mã QR.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionText}>Cấp quyền ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !user) return;
    setScanned(true);
    
    try {
      const eventId = data.trim();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      if (!uuidRegex.test(eventId)) {
        throw new Error("Mã QR không đúng định dạng sự kiện.");
      }

      const myEvents = await getUserRegistrations(user.id);
      const registration = myEvents.find((reg: any) => reg.id === eventId); 

      if (!registration) {
        throw new Error("Bạn chưa đăng ký tham gia sự kiện này.");
      }

      await updateRegistrationStatus(registration.registration_id, 'ATTENDED');

      setCurrentEventId(eventId);
      setStatus('success');
      
      setTimeout(() => {
        setShowFeedback(true);
      }, 1500);
      
    } catch (error: any) {
      console.error('Scan check-in error:', error);
      setErrorMsg(error.message || "Lỗi hệ thống khi điểm danh.");
      setStatus('error');
      setTimeout(() => {
        setScanned(false);
        setStatus('idle');
      }, 3500);
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
      <StatusBar barStyle="light-content" />
      
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        enableTorch={flash}
      />

      {/* UI Overlay - Outside CameraView using absolute positioning */}
      <View style={[StyleSheet.absoluteFillObject, styles.overlay]}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.focusedContainer}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {status === 'success' && (
                <View style={styles.resultOverlay}>
                  <SuccessAnimation message="Check-in thành công!" />
                </View>
              )}
              {status === 'error' && (
                <View style={styles.resultOverlay}>
                  <AlertCircle size={60} color={COLORS.error} />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}>
          <Text style={styles.hintText}>Vui lòng đưa mã QR vào khung hình</Text>
        </View>
      </View>

      {/* Floating Controls */}
      <View style={[styles.controls, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.circleBtn}
          >
            <X size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Điểm danh sự kiện</Text>
          <TouchableOpacity 
            onPress={() => setFlash(!flash)}
            style={styles.circleBtn}
          >
            {flash ? <Zap size={24} color="#FFD700" /> : <ZapOff size={24} color={COLORS.white} />}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showFeedback}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cảm ơn bạn!</Text>
            <Text style={styles.modalSub}>Hãy cho chúng tôi biết cảm nhận của bạn về sự kiện này</Text>
            
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star 
                    size={36} 
                    color={star <= rating ? "#FFD700" : COLORS.border} 
                    fill={star <= rating ? "#FFD700" : "transparent"} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Lời nhắn cho Ban Tổ Chức (không bắt buộc)..."
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
              placeholderTextColor={COLORS.textSecondary}
            />

            <TouchableOpacity 
              style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
              onPress={handleFeedbackSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.submitText}>Gửi phản hồi</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.skipText}>Bỏ qua</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    color: 'white',
    fontSize: 16,
  },
  permissionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 20,
  },
  permissionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  unfocusedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flexDirection: 'row',
    height: width * 0.7,
  },
  focusedContainer: {
    width: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 15,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 15,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 15,
  },
  hintText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.error,
      marginTop: 15,
      textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  modalSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },
  commentInput: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 25,
  },
  submitBtn: {
    width: '100%',
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  }
});

export default ScanQRScreen;
