import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from '../lib/theme';

const { width } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// SLIDE DATA — professional icons via Ionicons
// ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: '1',
    icon: 'heart',
    iconColor: COLORS.primary,
    iconBg: COLORS.primarySurface,
    title: 'Help Instantly',
    description: 'Connect with those in need and make a life-saving difference in real-time.',
  },
  {
    id: '2',
    icon: 'link',
    iconColor: COLORS.primary,
    iconBg: COLORS.primarySurface,
    title: 'Connect Directly',
    description: 'No middlemen. Direct link between donors, hospitals, and riders.',
  },
  {
    id: '3',
    icon: 'shield-checkmark',
    iconColor: COLORS.success,
    iconBg: COLORS.successLight,
    title: 'Save Lives',
    description: "Every donation counts. Be a hero in someone's story today.",
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Onboarding({ navigation }) {
  const [screen, setScreen] = useState('landing');
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // Landing animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  // Slides fade
  const slidesFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const goToSlides = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
      setScreen('slides');
      Animated.timing(slidesFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    });
  };

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setActiveIndex(next);
    } else {
      navigation.navigate('Register');
    }
  };

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  // ── LANDING ──────────────────────────────────────────────
  if (screen === 'landing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
        <Animated.View style={[
          styles.landingContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}>

          <View style={{ flex: 1 }} />

          {/* Logo */}
          <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoScale }] }]}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Brand name */}
          <View style={styles.brandWrapper}>
            <Text style={styles.brandName}>
              Red<Text style={styles.brandAccent}>Quest</Text>
            </Text>
            <View style={styles.underlineRow}>
              <View style={styles.underlineLine} />
              <View style={styles.underlineDot} />
              <View style={styles.underlineLine} />
            </View>
          </View>

          <Text style={styles.tagline}>
            Turn blood donation into a heroic quest.{'\n'}Save lives, one ride at a time.
          </Text>

          <View style={{ flex: 1 }} />

          {/* CTA Buttons */}
          <View style={styles.landingFooter}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={goToSlides}>
              <Text style={styles.primaryBtnText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>
                I already have an account
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.legalLink}>Terms of Service</Text> •{' '}
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>

        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── SLIDES ───────────────────────────────────────────────
  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <Animated.View style={[{ flex: 1 }, { opacity: slidesFade }]}>

        {/* Skip button (top right) */}
        {!isLast && (
          <TouchableOpacity
            style={styles.skipTopBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.skipTopText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Swipeable slides */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {SLIDES.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              {/* Icon circle */}
              <View style={[styles.iconCircle, { backgroundColor: slide.iconBg }]}>
                <Ionicons name={slide.icon} size={36} color={slide.iconColor} />
              </View>

              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideDesc}>{slide.description}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeIndex === i ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.slidesFooter}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={goNext}
          >
            <Text style={styles.primaryBtnText}>
              {isLast ? 'Get Started' : 'Continue'}
            </Text>
            <Ionicons
              name={isLast ? 'checkmark' : 'arrow-forward'}
              size={18}
              color={COLORS.white}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // ── Landing ──
  landingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 24,
    backgroundColor: COLORS.surface,
  },
  logoWrapper: {
    marginBottom: 24,
    alignItems: 'center',
  },
  logoImage: {
    width: 110,
    height: 110,
  },
  brandWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1.5,
  },
  brandAccent: {
    color: COLORS.primary,
  },
  underlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    width: 140,
    justifyContent: 'center',
  },
  underlineLine: {
    flex: 1,
    height: 2.5,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  underlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginHorizontal: 5,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 4,
  },
  landingFooter: {
    width: '100%',
    marginBottom: 16,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginLinkText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  legalText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    paddingBottom: 4,
  },
  legalLink: {
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },

  // ── Slides ──
  skipTopBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
  },
  skipTopText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    ...SHADOWS.card,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  slideDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
  },

  // ── Dots ──
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  dot: {
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 7,
    backgroundColor: COLORS.primaryMuted,
  },
  dotActive: {
    width: 28,
    backgroundColor: COLORS.primary,
  },

  // ── Shared buttons ──
  slidesFooter: {
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    ...SHADOWS.button,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
