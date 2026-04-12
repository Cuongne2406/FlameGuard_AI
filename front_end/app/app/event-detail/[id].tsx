import React, { useEffect, useState } from 'react';
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
  CheckCircle2
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS, SIZES } from '../../src/constants/theme';
import { getEventDetail, registerEvent, getUserRegistrations } from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';

const { width } = Dimensions.get('window');

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      try {
        const [detailData, registrations] = await Promise.all([
          getEventDetail(id),
          user ? getUserRegistrations(user.id) : []
        ]);
        
        setEvent(detailData);
        
        // Check if current user is in registrations list for this event
        const registered = registrations.some((reg: any) => reg.id === id); // /me/events trả về list event IDs
        setIsRegistered(registered);
      } catch (error) {
        console.error('Fetch event detail error:', error);
        Alert.alert("Lỗi", "Không thể tải thông tin sự kiện.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id, user]);

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

  const handleRegister = async () => {
    if (!user || !event) return;
    setRegistering(true);
    try {
      await registerEvent(event.id, user.id);
      setIsRegistered(true);
      Alert.alert("Thành công", "Đăng ký tham gia thành công! Đừng quên đến đúng giờ nhé.");
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert("Lỗi", "Đăng ký không thành công. Có thể bạn đã đăng ký hoặc sự kiện đã hết chỗ.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Không tìm thấy sự kiện.</Text>
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
          <View style={styles.pointsBadge}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.pointsText}>+{event.points || 15} ĐRL</Text>
          </View>
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
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={18} color={COLORS.text} />
              <Text style={styles.sectionTitle}>Giới thiệu sự kiện</Text>
            </View>
            <Text style={styles.description}>
              {event.description || "Chưa có mô tả chi tiết cho sự kiện này."}
              {"\n\n"}Đây là hoạt động nằm trong kế hoạch hoạt động của Đơn vị. Mục tiêu nhằm tạo sân chơi bổ ích, rèn luyện kỹ năng và tinh thần cống hiến cho sinh viên. 
              {"\n\n"}Sinh viên tham gia đầy đủ sẽ được cấp chứng nhận điện tử và điểm rèn luyện tự động qua app.
            </Text>
          </View>

          {/* Organizer Info */}
          <View style={styles.organizerCard}>
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
          
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Floating Bottom Button */}
      <View style={styles.bottomBar}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
          style={styles.bottomGradient}
        />
        <TouchableOpacity 
          style={[
            styles.registerBtn, 
            SHADOWS.medium,
            (isRegistered || event.status === 'ENDED') && { backgroundColor: COLORS.success }
          ]}
          onPress={handleRegister}
          disabled={isRegistered || registering || event.status === 'ENDED'}
        >
          {registering ? (
            <ActivityIndicator color={COLORS.white} />
          ) : isRegistered ? (
            <>
              <CheckCircle2 size={20} color={COLORS.white} />
              <Text style={styles.registerText}>Đã đăng ký tham gia</Text>
            </>
          ) : event.status === 'ENDED' ? (
             <Text style={styles.registerText}>Sự kiện đã kết thúc</Text>
          ) : (
            <>
              <Rocket size={20} color={COLORS.white} />
              <Text style={styles.registerText}>Đăng ký tham gia ngay</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Sub-component for info cards
const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoIconContainer}>{icon}</View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    height: 400,
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
    bottom: 30,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    marginTop: -25,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  titleSection: {
    marginBottom: 25,
  },
  organizer: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 36,
    marginBottom: 12,
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
    marginBottom: 30,
  },
  infoCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.white,
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
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.background,
    borderRadius: 20,
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
    height: 100,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  bottomGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  registerBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderRadius: 20,
    gap: 12,
  },
  registerText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
  }
});

export default EventDetailScreen;
