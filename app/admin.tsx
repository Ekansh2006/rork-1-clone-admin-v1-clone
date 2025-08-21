import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';
import { 
  Users, 
  FileText, 
  Flag, 
  MessageSquare, 
  TrendingUp, 
  UserCheck, 
  UserX, 
  Clock,
  BarChart3,
  Shield
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useUserRole } from '@/lib/userRoles';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface DashboardStats {
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  totalProfiles: number;
  totalFlags: number;
  totalComments: number;
  recentActivity: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
  badge?: number;
}

export default function AdminPanel() {
  const { loading: roleLoading, isAdmin } = useUserRole();
  const [stats, setStats] = useState<DashboardStats>({
    pendingUsers: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    totalProfiles: 0,
    totalFlags: 0,
    totalComments: 0,
    recentActivity: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      setupRealtimeListeners();
    }
  }, [roleLoading, isAdmin]);

  if (roleLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.text} />
        <Text style={styles.loadingText}>Checking admin...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return <Redirect href="/" />;
  }

  const setupRealtimeListeners = () => {
    console.log('[AdminPanel] Setting up real-time listeners');
    const unsubscribers: (() => void)[] = [];

    // Listen to users collection
    const usersQuery = collection(db, 'users');
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      let pending = 0, approved = 0, rejected = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        const status = data.verificationStatus;
        if (status === 'pending_verification') pending++;
        else if (status === 'approved_username_assigned') approved++;
        else if (status === 'rejected') rejected++;
      });
      
      setStats(prev => ({ ...prev, pendingUsers: pending, approvedUsers: approved, rejectedUsers: rejected }));
      console.log('[AdminPanel] Users stats updated:', { pending, approved, rejected });
    }, (error) => {
      console.error('[AdminPanel] Error listening to users:', error);
    });
    unsubscribers.push(unsubUsers);

    // Listen to profiles collection
    const profilesQuery = collection(db, 'profiles');
    const unsubProfiles = onSnapshot(profilesQuery, (snapshot) => {
      const totalProfiles = snapshot.size;
      setStats(prev => ({ ...prev, totalProfiles }));
      console.log('[AdminPanel] Profiles count updated:', totalProfiles);
    }, (error) => {
      console.error('[AdminPanel] Error listening to profiles:', error);
    });
    unsubscribers.push(unsubProfiles);

    // Listen to flags collection
    const flagsQuery = collection(db, 'flags');
    const unsubFlags = onSnapshot(flagsQuery, (snapshot) => {
      const totalFlags = snapshot.size;
      setStats(prev => ({ ...prev, totalFlags }));
      console.log('[AdminPanel] Flags count updated:', totalFlags);
    }, (error) => {
      console.error('[AdminPanel] Error listening to flags:', error);
    });
    unsubscribers.push(unsubFlags);

    // Listen to comments collection
    const commentsQuery = collection(db, 'comments');
    const unsubComments = onSnapshot(commentsQuery, (snapshot) => {
      const totalComments = snapshot.size;
      setStats(prev => ({ ...prev, totalComments }));
      console.log('[AdminPanel] Comments count updated:', totalComments);
    }, (error) => {
      console.error('[AdminPanel] Error listening to comments:', error);
    });
    unsubscribers.push(unsubComments);

    setIsLoading(false);

    // Cleanup function
    return () => {
      console.log('[AdminPanel] Cleaning up listeners');
      unsubscribers.forEach(unsub => unsub());
    };
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <View style={styles.statHeader}>
        {icon}
        <Text style={styles.statValue}>{value.toLocaleString()}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, onPress, badge }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionHeader}>
        <View style={styles.actionIconContainer}>
          {icon}
          {badge !== undefined && badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const BeerLogo = () => (
    <View style={styles.logoContainer}>
      <Image 
        source={{ uri: 'https://r2-pub.rork.com/attachments/bcjlgxvpsdw5ajmunl9az' }}
        style={styles.logoImage}
        contentFit="contain"
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.text} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <BeerLogo />
          <Text style={styles.appTitle}>admin dashboard</Text>
        </View>
        <View style={styles.headerBadge}>
          <Shield size={20} color={Colors.light.text} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Pending Users"
              value={stats.pendingUsers}
              icon={<Clock size={24} color="#000000" />}
              color="#FFE4B5"
              subtitle="Awaiting approval"
            />
            <StatCard
              title="Approved Users"
              value={stats.approvedUsers}
              icon={<UserCheck size={24} color="#000000" />}
              color="#90EE90"
              subtitle="Active members"
            />
            <StatCard
              title="Total Profiles"
              value={stats.totalProfiles}
              icon={<FileText size={24} color="#000000" />}
              color="#87CEEB"
              subtitle="Published profiles"
            />
            <StatCard
              title="Content Reports"
              value={stats.totalFlags}
              icon={<Flag size={24} color="#000000" />}
              color="#FFB6C1"
              subtitle="Flagged content"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management Tools</Text>
          <View style={styles.actionsGrid}>
            <ActionCard
              title="User Approval"
              description="Review and approve pending user registrations"
              icon={<Users size={32} color={Colors.light.text} />}
              onPress={() => router.push('/admin/user-approval')}
              badge={stats.pendingUsers}
            />
            <ActionCard
              title="Content Moderation"
              description="Review flagged profiles and comments"
              icon={<Flag size={32} color={Colors.light.text} />}
              onPress={() => router.push('/admin/content-moderation')}
              badge={stats.totalFlags}
            />
          </View>
        </View>

        {/* Additional Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Activity</Text>
          <View style={styles.statsRow}>
            <View style={styles.miniStatCard}>
              <MessageSquare size={20} color={Colors.light.text} />
              <Text style={styles.miniStatValue}>{stats.totalComments}</Text>
              <Text style={styles.miniStatLabel}>Comments</Text>
            </View>
            <View style={styles.miniStatCard}>
              <UserX size={20} color={Colors.light.text} />
              <Text style={styles.miniStatValue}>{stats.rejectedUsers}</Text>
              <Text style={styles.miniStatLabel}>Rejected</Text>
            </View>
            <View style={styles.miniStatCard}>
              <TrendingUp size={20} color={Colors.light.text} />
              <Text style={styles.miniStatValue}>{stats.approvedUsers + stats.pendingUsers}</Text>
              <Text style={styles.miniStatLabel}>Total Users</Text>
            </View>
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <BarChart3 size={24} color={Colors.light.text} />
              <Text style={styles.statusTitle}>System Status</Text>
            </View>
            <Text style={styles.statusText}>All systems operational</Text>
            <Text style={styles.statusSubtext}>Real-time data sync active</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: Colors.light.text,
    textTransform: 'lowercase' as const,
  },
  headerBadge: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '900' as const,
    color: Colors.light.text,
    marginTop: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900' as const,
    color: Colors.light.text,
    marginBottom: 16,
    textTransform: 'lowercase' as const,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: cardWidth,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: '#000000',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '900' as const,
    color: '#000000',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#000000',
    opacity: 0.7,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: cardWidth,
    padding: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
  },
  actionHeader: {
    marginBottom: 12,
  },
  actionIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900' as const,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '900' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.tabIconDefault,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatCard: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    gap: 4,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '900' as const,
    color: Colors.light.text,
  },
  miniStatLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.tabIconDefault,
  },
  statusCard: {
    padding: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '900' as const,
    color: Colors.light.text,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#22C55E',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.tabIconDefault,
  },
});