import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
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
  Briefcase,
} from 'lucide-react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { COLORS, SHADOWS, SIZES } from '../src/constants/theme';
import { useAuth } from '../src/context/AuthContext';
import { createAward, getAwards } from '../src/api/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormInput from '../src/components/common/FormInput';
import PremiumButton from '../src/components/common/PremiumButton';
import GlassCard from '../src/components/common/GlassCard';

const awardRequestSchema = z.object({
  description: z.string().min(10, 'Mo ta qua ngan. Vui long ghi chi tiet hon.'),
  link: z.string().url('Vui long nhap dung dinh dang link Drive.'),
});

type AwardRequestFormData = z.infer<typeof awardRequestSchema>;

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'DANG CHO',
    color: '#FF9800',
    bg: '#FFF3E0',
    icon: <Clock size={24} color="#FF9800" />,
  },
  APPROVED: {
    label: 'DA DUYET',
    color: '#4CAF50',
    bg: '#E8F5E9',
    icon: <CheckCircle2 size={24} color="#4CAF50" />,
  },
};

export default function AwardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const { control, handleSubmit, reset } = useForm<AwardRequestFormData>({
    resolver: zodResolver(awardRequestSchema),
    defaultValues: {
      description: '',
      link: '',
    },
  });

  const { data: awards = [] } = useQuery({
    queryKey: ['mobile-awards'],
    queryFn: getAwards,
    enabled: !!user,
  });

  const myAwards = useMemo(
    () => (Array.isArray(awards) ? awards.filter((item: any) => item.user_id === user?.id) : []),
    [awards, user?.id]
  );

  const summary = useMemo(
    () => ({
      total: myAwards.length,
      approved: myAwards.filter((item: any) => item.status === 'APPROVED').length,
      pending: myAwards.filter((item: any) => item.status === 'PENDING').length,
    }),
    [myAwards]
  );

  const submitMutation = useMutation({
    mutationFn: (data: AwardRequestFormData) =>
      createAward({
        user_id: user?.id,
        award_name: 'Sinh vien 5 tot cap Truong',
        description: data.description,
        evidence_url: data.link,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mobile-awards'] });
      setModalVisible(false);
      reset();
      Alert.alert('Thanh cong', 'Da gui ho so xet duyet thanh cong.');
    },
    onError: () => {
      Alert.alert('Loi', 'Khong the gui ho so luc nay.');
    },
  });

  const onSubmit = (data: AwardRequestFormData) => {
    if (!user?.id) {
      Alert.alert('Thong bao', 'Vui long dang nhap lai de nop ho so.');
      return;
    }
    submitMutation.mutate(data);
  };

  const badges: Array<{ id: number; name: string; icon: React.ReactNode; colors: readonly [string, string] }> = [
    { id: 1, name: 'Dao duc tot', icon: <Heart size={32} color="#fff" />, colors: ['#E63946', '#CD1A2A'] },
    { id: 2, name: 'Hoc tap tot', icon: <BookOpen size={32} color="#fff" />, colors: ['#4361EE', '#3A0CA3'] },
    { id: 3, name: 'The luc tot', icon: <Award size={32} color="#fff" />, colors: ['#4CAF50', '#2E7D32'] },
    { id: 4, name: 'Tinh nguyen tot', icon: <Star size={32} color="#fff" />, colors: ['#FF9800', '#F57C00'] },
    { id: 5, name: 'Hoi nhap tot', icon: <Briefcase size={32} color="#fff" />, colors: ['#9C27B0', '#7B1FA2'] },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trung tam Thanh tich</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#1e3c72', '#2a5298']} style={[styles.heroCard, SHADOWS.medium]}>
          <View style={styles.heroContent}>
            <View>
              <View style={styles.tagContainer}>
                <Text style={styles.tagText}>NAM HOC 2025-2026</Text>
              </View>
              <Text style={styles.heroTitle}>Sinh vien 5 tot</Text>
              <Text style={styles.heroSub}>
                Ban dang co {summary.approved}/5 moc da duoc duyet ho so tren he thong.
              </Text>
            </View>
            <Trophy size={64} color="#FFD700" opacity={0.9} />
          </View>

          <PremiumButton
            title="Nop ho so minh chung ngay"
            onPress={() => setModalVisible(true)}
            variant="secondary"
            icon={<CloudUpload size={18} color={COLORS.white} />}
            style={{ height: 48 }}
          />
        </LinearGradient>

        <Text style={styles.sectionTitle}>Tien trinh Xet duyet</Text>
        <GlassCard style={{ marginBottom: 30 }}>
          {myAwards.length > 0 ? (
            myAwards.map((item: any, index: number) => {
              const config = statusConfig[item.status] || statusConfig.PENDING;
              return (
                <View key={item.id}>
                  <View style={styles.historyItem}>
                    <View style={[styles.iconBox, { backgroundColor: config.bg }]}>{config.icon}</View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyTitle}>{item.award_name}</Text>
                      <Text style={styles.historyDate}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString('vi-VN')
                          : 'Chua co ngay nop'}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                    </View>
                  </View>
                  {index < myAwards.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })
          ) : (
            <Text style={styles.historyDate}>Ban chua co ho so xet duyet nao.</Text>
          )}
        </GlassCard>

        <Text style={styles.sectionTitle}>Phong Truyen thong</Text>
        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <View key={badge.id} style={styles.badgeWrapper}>
              <LinearGradient colors={badge.colors} style={[styles.badgeCircle, SHADOWS.medium]}>
                {badge.icon}
              </LinearGradient>
              <Text style={styles.badgeName}>{badge.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.bottomSheet, SHADOWS.large]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Nop Ho so Minh chung</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <X size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <FormInput control={control} name="description" placeholder="Mo ta ngan gon cac hoat dong noi bat..." multiline numberOfLines={3} />
            <FormInput control={control} name="link" placeholder="Link Drive (https://drive.google.com/...)" />

            <PremiumButton
              title={submitMutation.isPending ? 'DANG GUI...' : 'GUI XET DUYET'}
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
  heroCard: { borderRadius: 24, padding: 24, marginBottom: 30 },
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
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 15, marginTop: 10 },
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
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeName: { fontSize: 12, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: SIZES.padding,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  closeBtn: { padding: 5, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 15 },
});
