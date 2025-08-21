import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Clock, Mail, CheckCircle, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';

// Demo function to simulate admin approval
const simulateAdminApproval = async (updateUserStatus: any) => {
  // Simulate admin approval process
  await updateUserStatus('approved_username_assigned');
};

export default function VerificationPendingScreen() {
  const { user, logout, updateUserStatus, isUserApproved } = useUser();

  // Listen for status changes and redirect when approved
  useEffect(() => {
    console.log('[verification-pending] user status check:', {
      user: !!user,
      isUserApproved,
      userStatus: user?.status
    });
    
    if (isUserApproved) {
      console.log('[verification-pending] user approved, redirecting to welcome');
      router.replace('/welcome');
    }
  }, [isUserApproved, user]);

  // Debug user state
  useEffect(() => {
    console.log('[verification-pending] mounted with user:', {
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      userStatus: user?.status,
      isUserApproved
    });
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const BeerLogo = () => (
    <View style={styles.logoContainer}>
      <Image 
        source={{ uri: 'https://r2-pub.rork.com/attachments/bcjlgxvpsdw5ajmunl9az' }}
        style={styles.logoImage}
        contentFit="contain"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <BeerLogo />
          <Text style={styles.appTitle}>beer</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
          <X size={24} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <View style={styles.iconContainer}>
            <Clock size={64} color={Colors.light.text} />
          </View>
          
          <Text style={styles.title}>account under review</Text>
          
          <Text style={styles.subtitle}>
            your registration is being verified by our team
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <CheckCircle size={20} color={Colors.light.text} />
              <Text style={styles.infoText}>account created successfully</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={20} color={Colors.light.text} />
              <Text style={styles.infoText}>verification in progress</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Mail size={20} color={Colors.light.text} />
              <Text style={styles.infoText}>email notification pending</Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>what happens next?</Text>
            <Text style={styles.detailsText}>
              • our team will review your selfie for men-only verification
            </Text>
            <Text style={styles.detailsText}>
              • verification typically takes 24-48 hours
            </Text>
            <Text style={styles.detailsText}>
              • you&apos;ll receive an email with your assigned username once approved
            </Text>
            <Text style={styles.detailsText}>
              • after approval, you can access the full beer community
            </Text>
          </View>

          {user && (
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoTitle}>registration details</Text>
              <Text style={styles.userInfoText}>name: {user.name}</Text>
              <Text style={styles.userInfoText}>email: {user.email}</Text>
              <Text style={styles.userInfoText}>
                submitted: {user.createdAt.toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Demo approval button - remove in production */}
        <TouchableOpacity
          style={styles.demoButton}
          onPress={() => simulateAdminApproval(updateUserStatus)}
          activeOpacity={0.8}
        >
          <Text style={styles.demoButtonText}>demo: approve account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>logout</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 28,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    color: Colors.light.text,
    textTransform: 'lowercase' as const,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  infoContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    color: Colors.light.text,
    flex: 1,
  },
  detailsContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    width: '100%',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    color: Colors.light.text,
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  userInfoContainer: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 20,
    width: '100%',
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    color: Colors.light.text,
    marginBottom: 12,
  },
  userInfoText: {
    fontSize: 14,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    color: Colors.light.text,
    marginBottom: 4,
  },
  logoutButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
  },
  demoButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  demoButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '900' as const,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
  },
});