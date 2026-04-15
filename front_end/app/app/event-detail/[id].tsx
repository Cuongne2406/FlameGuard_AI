import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Share,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  ChevronLeft, 
  Share2, 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Info,
  Rocket,
  CheckCircle2,
  MessageSquare,
  Send
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SIZES } from '../../src/constants/theme';
import { 
  getEventDetail, 
  registerEvent, 
  getUserRegistrations, 
  getEventQA, 
  postQuestion 
} from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GlassCard from '../../src/components/common/GlassCard';
import PremiumButton from '../../src/components/common/PremiumButton';

const { width } = Dimensions.get('window');

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [newQuestion, setNewQuestion] = useState('');

  // 1. Fetch Event Detail
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventDetail(id as string),
    enabled: !!id,
  });

  // 2. Fetch User Registrations to check if already registered
  const { data: registrations } = useQuery({
    queryKey: ['userRegistrations', user?.id],
    queryFn: () => getUserRegistrations(user?.id),
    enabled: !!user,
  });

  const isRegistered = registrations?.some((reg: any) => reg.id === id);

  // 3. Fetch QA
  const { data: qaList = [], isLoading: qaLoading } = useQuery({
    queryKey: ['eventQA', id],
    queryFn: () => getEventQA(id as string),
    enabled: !!id,
  });

  // Mutations
  const registerMutation = useMutation({
    mutationFn: () => registerEvent(id as string, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRegistrations', user?.id] });
      Alert.alert("Thành công", "Đăng ký tham gia thành công! Đừng quên đến đúng giờ nhé.");
    },
    onError: (error) => {
      console.error('Registration error:', error);
      Alert.alert("Lỗi", "Đăng ký không thành công. Có thể bạn đã đăng ký hoặc sự kiện đã hết chỗ.");
    }
  });

  const postQaMutation = useMutation({
    mutationFn: (question: string) => postQuestion(id as string, question, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventQA', id] });
      setNewQuestion('');
      Alert.alert("Thành công", "Câu hỏi của bạn đã được gửi. BTC sẽ sớm phản hồi!");
    },
    onError: () => {
      Alert.alert("Lỗi", "Không thể gửi câu hỏi lúc này.");
    }
  });

  const handleShare = async () => {
    if (!event) return;
    try {
      await Share.share({
        message: `Tham gia sự kiện ${event.name} cùng mình trên YouthHub nhé!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = () => {
    if (!user) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để đăng ký tham gia.");
      return;
    }
    registerMutation.mutate();
  };

  const handlePostQA = () => {
    if (!newQuestion.trim() || !user) return;
    postQaMutation.mutate(newQuestion);
  };

  if (eventLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Không tìm thấy sự kiện.</Text>
      </View>
    );
  }

  const startDate = event.start_time ? new Date(event.start_time).toLocaleDateString('vi-VN') : 'Sắp tới';
  const imageUrl = event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageOverlay}
          />
          
          {/* Navigation Actions */}
          <View style={styles.topActions}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.actionButton}
            >
              <ChevronLeft size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleShare}
              style={styles.actionButton}
            >
              <Share2 size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Points Badge */}
          <GlassCard style={styles.pointsBadge} opacity={0.95}>
            <View style={styles.pointsContent}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.pointsText}>+{event.points || 15} ĐRL</Text>
            </View>
          </GlassCard>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.organizer}>{event.organization_name || 'Đoàn trường'}</Text>
            <Text style={styles.title}>{event.name}</Text>
            <View style={styles.statusChip}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{event.status}</Text>
            </View>
          </View>

          {/* Quick Info Cards */}
          <View style={styles.infoRow}>
            <InfoCard 
              icon={<Calendar size={20} color={COLORS.primary} />}
              label="Thời gian"
              value={startDate}
            />
            <InfoCard 
              icon={<MapPin size={20} color={COLORS.secondary} />}
              label="Địa điểm"
              value={event.location || 'Chưa xác định'}
            />
          </View>

          {/* Detailed Info Section */}
          <GlassCard style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Info size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.sectionTitle}>Giới thiệu sự kiện</Text>
            </View>
            <Text style={styles.description}>
              {event.description || "Chưa có mô tả chi tiết cho sự kiện này."}
              {"\n\n"}Đây là hoạt động nằm trong kế hoạch hoạt động của Đơn vị. Mục tiêu nhằm tạo sân chơi bổ ích, rèn luyện kỹ năng và tinh thần cống hiến cho sinh viên. 
              {"\n\n"}Sinh viên tham gia đầy đủ sẽ được cấp chứng nhận điện tử và điểm rèn luyện tự động qua app.
            </Text>
          </GlassCard>

          {/* Organizer Info */}
          <GlassCard style={styles.organizerCard}>
            <View style={styles.orgContent}>
              <View style={styles.orgAvatar}>
                <Users size={24} color={COLORS.primary} />
              </View>
              <View style={styles.orgInfo}>
                <Text style={styles.orgLabel}>Ban tổ chức</Text>
                <Text style={styles.orgName}>{event.organization_name || 'Đoàn TNCS Hồ Chí Minh'}</Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followText}>Theo dõi</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Q&A Section */}
          <View style={[styles.section, { marginTop: 30 }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <MessageSquare size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.sectionTitle}>Hỏi & Đáp trực tuyến</Text>
            </View>
            
            {qaLoading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : qaList.length === 0 ? (
              <Text style={styles.emptyQa}>Chưa có câu hỏi nào. Hãy là người đầu tiên!</Text>
            ) : (
              qaList.map((qa: any) => (
                <GlassCard key={qa.id} style={styles.qaItem}>
                  <View style={styles.questionRow}>
                    <View style={styles.qIndicator}><Text style={styles.qText}>Q</Text></View>
                    <Text style={styles.questionText}>{qa.question}</Text>
                  </View>
                  {qa.is_answered ? (
                    <View style={styles.answerRow}>
                      <View style={styles.aIndicator}><Text style={styles.aText}>A</Text></View>
                      <Text style={styles.answerText}>{qa.answer}</Text>
                    </View>
                  ) : (
                    <Text style={styles.pendingAnswer}>Đang chờ Ban tổ chức phản hồi...</Text>
                  )}
                </GlassCard>
              ))
            )}

            {/* Post Question Form */}
            <View style={styles.qaForm}>
              <View style={styles.qaInputContainer}>
                <MessageSquare size={18} color={COLORS.textSecondary} style={{ marginLeft: 15 }} />
                <TextInput
                  style={styles.qaInput}
                  placeholder="Đặt câu hỏi cho BTC..."
                  value={newQuestion}
                  onChangeText={setNewQuestion}
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>
              <TouchableOpacity 
                style={[styles.sendQaBtn, (!newQuestion.trim() || postQaMutation.isPending) && { opacity: 0.5 }]}
                disabled={!newQuestion.trim() || postQaMutation.isPending}
                onPress={handlePostQA}
              >
                {postQaMutation.isPending ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Send size={18} color={COLORS.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Floating Bottom Button */}
      <View style={styles.bottomBar}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
          style={styles.bottomGradient}
        />
        <PremiumButton 
          title={isRegistered ? "Đã đăng ký tham gia" : event.status === 'ENDED' ? "Sự kiện đã kết thúc" : "Đăng ký tham gia ngay"}
          onPress={handleRegister}
          loading={registerMutation.isPending}
          disabled={isRegistered || event.status === 'ENDED'}
          variant={isRegistered || event.status === 'ENDED' ? 'ghost' : 'primary'}
          icon={isRegistered ? <CheckCircle2 size={20} color={COLORS.primary} /> : event.status === 'ENDED' ? null : <Rocket size={20} color={COLORS.white} />}
          style={styles.registerBtn}
        />
      </View>
    </View>
  );
};

// Sub-component for info cards
const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <GlassCard style={styles.infoCard}>
    <View style={styles.infoCardContent}>
      <View style={styles.infoIconContainer}>{icon}</View>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  </GlassCard>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    height: 420,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topActions: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  actionButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pointsBadge: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    padding: 0,
    borderRadius: 20,
    height: 40,
  },
  pointsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: '100%',
    gap: 8,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    marginTop: -30,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 25,
  },
  titleSection: {
    marginBottom: 25,
  },
  organizer: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 36,
    marginBottom: 15,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0EA5E9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  infoCard: {
    flex: 1,
    padding: 0,
    borderRadius: 20,
  },
  infoCardContent: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(67, 97, 238, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
    maxWidth: width * 0.25,
  },
  sectionCard: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 25,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  organizerCard: {
    padding: 0,
    borderRadius: 20,
    marginBottom: 10,
  },
  orgContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  orgAvatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orgInfo: {
    flex: 1,
  },
  orgLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  orgName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  followBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
    paddingHorizontal: 25,
    justifyContent: 'center',
    zIndex: 100,
  },
  bottomGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  registerBtn: {
    height: 60,
  },
  emptyQa: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 24,
  },
  qaItem: {
    padding: 15,
    borderRadius: 18,
    marginBottom: 15,
  },
  questionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  qIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  answerRow: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 4,
  },
  aIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  answerText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  pendingAnswer: {
    fontSize: 12,
    color: COLORS.warning,
    fontStyle: 'italic',
    marginLeft: 40,
  },
  qaForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 15,
  },
  qaInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    height: 54,
    borderRadius: 16,
  },
  qaInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  sendQaBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default EventDetailScreen;
