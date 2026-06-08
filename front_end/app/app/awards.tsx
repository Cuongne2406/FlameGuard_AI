import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Trophy, 
  Award, 
  Star, 
  BookOpen, 
  Heart,
  CloudUpload,
  X,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react-native';
import { COLORS, SHADOWS, SIZES } from '../src/constants/theme';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../src/components/common/FormInput';
import PremiumButton from '../src/components/common/PremiumButton';
import GlassCard from '../src/components/common/GlassCard';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../src/context/AuthContext';
import { getAwards, submitAwardRequest } from '../src/api/client';

const awardRequestSchema = z.object({
  description: z.string().min(10, 'Mô tả quá ngắn. Vui lòng ghi chi tiết hơn.'),
  link: z.string().url('Vui lòng nhập đúng định dạng link Drive (http://... hoặc https://...)')
});

type AwardRequestFormData = z.infer<typeof awardRequestSchema>;

export default function AwardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<AwardRequestFormData>({
    resolver: zodResolver(awardRequestSchema),
    defaultValues: {
      description: '',
      link: ''
    }
  });

  const { data: rawAwards = [], isLoading: isLoadingAwards } = useQuery({
    queryKey: ['userAwards', user?.id],
    queryFn: () => getAwards(0, 100),
    enabled: !!user,
  });

  const myAwards = useMemo(() => {
    if (!user) return [];
    return (rawAwards as any[]).filter((award: any) => award.user_id === user.id);
  }, [rawAwards, user]);

  const submitAwardMutation = useMutation({
    mutationFn: (data: AwardRequestFormData) => submitAwardRequest({
      user_id: user?.id,
      award_name: "Sinh viên 5 Tốt",
      description: data.description,
      evidence_url: data.link,
      points: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAwards', user?.id] });
      setModalVisible(false);
      reset();
      Alert.alert('Thành công', 'Đã gửi hồ sơ xét duyệt thành công!');
    },
    onError: (err: any) => {
      console.error(err);
      Alert.alert('Lỗi', 'Gửi hồ sơ xét duyệt thất bại. Vui lòng thử lại sau.');
    }
  });

  const onSubmit = (data: AwardRequestFormData) => {
    submitAwardMutation.mutate(data);
  };

  const badges = [
    { id: 1, name: 'Đạo đức tốt', icon: <Heart size={32} color="#fff" />, colors: ['#E63946', '#CD1A2A'] },
    { id: 2, name: 'Học tập tốt', icon: <BookOpen size={32} color="#fff" />, colors: ['#4361EE', '#3A0CA3'] },
    { id: 3, name: 'Thể lực tốt', icon: <Award size={32} color="#fff" />, colors: ['#4CAF50', '#2E7D32'] },
    { id: 4, name: 'Tình nguyện tốt', icon: <Star size={32} color="#fff" />, colors: ['#FF9800', '#F57C00'] },
    { id: 5, name: 'Hội nhập tốt', icon: <Briefcase size={32} color="#fff" />, colors: ['#9C27B0', '#7B1FA2'] },
  ];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trung tâm Thành tích</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HERO SECTION */}
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={[styles.heroCard, SHADOWS.medium]}
        >
          <View style={styles.heroContent}>
            <View>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>NĂM HỌC 2025-2026</Text>
              </View>
              <Text style={styles.heroTitle}>Sinh viên 5 Tốt</Text>
              <Text style={styles.heroSub}>Bạn đã đạt 2/5 tiêu chí cấp Trường.</Text>
            </View>
            <Trophy size={64} color="#FFD700" opacity={0.9} />
          </View>

          <PremiumButton 
            title="Nộp hồ sơ minh chứng ngay"
            onPress={() => setModalVisible(true)}
            variant="secondary"
            icon={<CloudUpload size={18} color={COLORS.white} />}
            style={{ height: 48 }}
          />
        </LinearGradient>

        {/* LỊCH SỬ HỒ SƠ */}
        <Text style={styles.sectionTitle}>Tiến trình Xét duyệt</Text>
        <GlassCard style={{ marginBottom: 30 }}>
          {isLoadingAwards ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
          ) : myAwards.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: COLORS.textSecondary, fontSize: 13, fontWeight: '500' }}>
                Chưa có hồ sơ xét duyệt nào được gửi.
              </Text>
            </View>
          ) : (
            myAwards.map((award: any, index: number) => {
              const isApproved = award.status === 'APPROVED' || award.status === 'Approved';
              const isRejected = award.status === 'REJECTED' || award.status === 'Rejected';
              
              const badgeColor = isApproved ? '#4CAF50' : isRejected ? '#EF4444' : '#FF9800';
              const badgeBg = isApproved ? '#E8F5E9' : isRejected ? '#FEE2E2' : '#FFF3E0';
              const statusText = isApproved ? 'ĐÃ DUYỆT' : isRejected ? 'BỊ TỪ CHỐI' : 'ĐANG CHỜ';

              const formattedDate = award.awarded_date ? new Date(award.awarded_date).toLocaleDateString('vi-VN') : 'Mới gửi';

              return (
                <View key={award.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.historyItem}>
                    <View style={[styles.iconBox, { backgroundColor: `${badgeColor}15` }]}>
                      {isApproved ? (
                        <CheckCircle2 size={24} color="#4CAF50" />
                      ) : isRejected ? (
                        <X size={24} color="#EF4444" />
                      ) : (
                        <Clock size={24} color="#FF9800" />
                      )}
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyTitle}>{award.award_name}</Text>
                      <Text style={styles.historyDate} numberOfLines={1}>{award.description || 'Không có mô tả'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
                      <Text style={[styles.statusText, { color: badgeColor }]}>{statusText}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </GlassCard>

        {/* BADGES COLLECTION */}
        <Text style={styles.sectionTitle}>Phòng Truyền thống</Text>
        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <View key={badge.id} style={styles.badgeWrapper}>
              <LinearGradient
                colors={badge.colors}
                style={[styles.badgeCircle, SHADOWS.medium]}
              >
                {badge.icon}
              </LinearGradient>
              <Text style={styles.badgeName}>{badge.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* MODAL NỘP ĐƠN */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.bottomSheet, SHADOWS.large]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Nộp Hồ sơ Minh chứng</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <FormInput 
              control={control}
              name="description"
              placeholder="Ngắn gọn các hoạt động nổi bật..."
              multiline
              numberOfLines={3}
            />

            <FormInput 
              control={control}
              name="link"
              placeholder="Link Drive (https://drive.google.com/...)"
            />

            <PremiumButton 
              title="GỬI XÉT DUYỆT"
              onPress={handleSubmit(onSubmit)}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 15,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  scrollContent: { padding: SIZES.padding, paddingBottom: 100 },
  
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tagContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tagText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  heroTitle: { color: COLORS.white, fontSize: 24, fontWeight: '900', marginBottom: 4 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, maxWidth: '80%' },
  applyBtn: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  applyBtnText: { color: '#1e3c72', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 15, marginTop: 10 },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, marginBottom: 30 },
  historyItem: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  historyInfo: { flex: 1, marginLeft: 15 },
  historyTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  historyDate: { fontSize: 12, color: COLORS.textSecondary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 15 },
  
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  badgeWrapper: { width: '30%', alignItems: 'center', marginBottom: 20 },
  badgeCircle: {
    width: 70, height: 70, borderRadius: 35,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: { fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: SIZES.padding, paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  closeBtn: { padding: 5, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 15 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  input: {
    backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E9ECEF',
    borderRadius: 16, padding: 15, fontSize: 15, color: COLORS.text,
  },
  submitBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800', tracking: 1 },
});
