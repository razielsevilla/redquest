import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Line,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────
// LANDING: smooth RedQuest logo illustration
// ─────────────────────────────────────────────────────────────
function HeroIllustration() {
  return (
    <Svg width={250} height={220} viewBox="0 0 250 220">
      <Defs>
        <LinearGradient id="dropGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FF5252" />
          <Stop offset="100%" stopColor="#B71C1C" />
        </LinearGradient>
        <RadialGradient id="dotGrad" cx="50%" cy="35%" r="65%">
          <Stop offset="0%" stopColor="#FF6B6B" />
          <Stop offset="100%" stopColor="#C62828" />
        </RadialGradient>
        <LinearGradient id="sleeveGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#F0F0F0" />
          <Stop offset="100%" stopColor="#D8D8D8" />
        </LinearGradient>
        <LinearGradient id="handGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FAFAFA" />
          <Stop offset="100%" stopColor="#E8E8E8" />
        </LinearGradient>
      </Defs>

      {/* Orbit ring */}
      <Ellipse cx="125" cy="82" rx="76" ry="26" fill="none"
        stroke="#CCCCCC" strokeWidth="1.8" strokeDasharray="7 5" strokeLinecap="round" />

      {/* Drop shadow */}
      <Ellipse cx="125" cy="132" rx="22" ry="6" fill="rgba(0,0,0,0.08)" />

      {/* Blood drop */}
      <Path d="M125 28 C111 46 94 62 90 84 C86 106 103 130 125 130 C147 130 164 106 160 84 C156 62 139 46 125 28 Z"
        fill="url(#dropGrad)" />
      <Path d="M111 56 C107 67 106 79 110 90"
        stroke="rgba(255,255,255,0.5)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <Path d="M116 46 C114 51 113 56 115 60"
        stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Satellite dots */}
      <Circle cx="52" cy="79" r="7" fill="url(#dotGrad)" />
      <Circle cx="52" cy="77" r="2.5" fill="rgba(255,255,255,0.5)" />
      <Circle cx="198" cy="85" r="7" fill="url(#dotGrad)" />
      <Circle cx="198" cy="83" r="2.5" fill="rgba(255,255,255,0.5)" />
      <Circle cx="125" cy="56" r="5.5" fill="url(#dotGrad)" opacity="0.75" />

      {/* Connector lines */}
      <Line x1="90" y1="92" x2="59" y2="82" stroke="#CCCCCC" strokeWidth="1.2" strokeDasharray="3 3" strokeLinecap="round" />
      <Line x1="160" y1="92" x2="191" y2="86" stroke="#CCCCCC" strokeWidth="1.2" strokeDasharray="3 3" strokeLinecap="round" />

      {/* Left sleeve */}
      <Path d="M18 175 C30 165 60 150 97 143 L107 158 C75 164 45 178 22 188 Z"
        fill="url(#sleeveGrad)" stroke="#C8C8C8" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Right sleeve */}
      <Path d="M232 175 C220 165 190 150 153 143 L143 158 C175 164 205 178 228 188 Z"
        fill="url(#sleeveGrad)" stroke="#C8C8C8" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Left hand */}
      <Path d="M97 143 C103 136 112 130 118 133 C120 134 121 136 122 138 L122 158 L107 158 Z"
        fill="url(#handGrad)" stroke="#C8C8C8" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Right hand */}
      <Path d="M153 143 C147 136 138 130 132 133 C130 134 129 136 128 138 L128 158 L143 158 Z"
        fill="url(#handGrad)" stroke="#C8C8C8" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Clasped fingers */}
      <Path d="M118 133 C119 129 121 126 125 126 C129 126 131 129 132 133 C131 136 129 138 128 138 L122 138 C121 138 119 136 118 133 Z"
        fill="url(#handGrad)" stroke="#C8C8C8" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Knuckle creases */}
      <Path d="M119 135 C121 132 124 132 126 135" stroke="#BBBBBB" strokeWidth="1" fill="none" strokeLinecap="round" />
      <Path d="M116 140 C118 137 121 137 123 140" stroke="#BBBBBB" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <Path d="M127 140 C129 137 132 137 134 140" stroke="#BBBBBB" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE ICONS
// ─────────────────────────────────────────────────────────────
function HeartIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
        stroke="#D32F2F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LinkIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997"
        stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7642 9.26323 11.0684 9.05888 10.3533 9.00766C9.63816 8.95643 8.92037 9.05961 8.24861 9.31018C7.57685 9.56074 6.96684 9.95295 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3961 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82"
        stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 6V12C4 16.4183 7.58172 21 12 22C16.4183 21 20 16.4183 20 12V6L12 2Z"
        stroke="#2E7D32"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SLIDE DATA
// ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: '1',
    icon: <HeartIcon />,
    iconBg: '#FDECEA',
    title: 'Help Instantly',
    description: 'Connect with those in need and make a difference in real-time',
  },
  {
    id: '2',
    icon: <LinkIcon />,
    iconBg: '#FDECEA',
    title: 'Connect Directly',
    description: 'No middlemen. Direct connection between donors, doctors, and riders',
  },
  {
    id: '3',
    icon: <ShieldIcon />,
    iconBg: '#E8F5E9',
    title: 'Save Lives',
    description: "Every donation counts. Be a hero in someone's story",
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Onboarding({ navigation }) {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'slides'
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  // Landing animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Slides fade
  const slidesFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
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
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Animated.View style={[styles.landingContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          <View style={{ flex: 1 }} />

          <View style={styles.illustrationWrapper}>
            <HeroIllustration />
          </View>

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
            Connecting donors and seekers{'\n'}fast and simply
          </Text>

          <View style={{ flex: 1 }} />

          <View style={styles.landingFooter}>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85} onPress={goToSlides}>
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginLink} activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>I already have an account</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.legalLink}>Terms of Service</Text> •{' '}
            <Text style={styles.legalLink}>Privacy Policy</Text> •{' '}
            <Text style={styles.legalLink}>Content Policy</Text>
          </Text>

        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── SLIDES ───────────────────────────────────────────────
  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Animated.View style={[{ flex: 1 }, { opacity: slidesFade }]}>

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
                {slide.icon}
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
              {isLast ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>

          {!isLast && (
            <TouchableOpacity
              style={styles.skipBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: '#FFFFFF',
  },

  // ── Landing ──
  landingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  illustrationWrapper: {
    marginBottom: 28,
    alignItems: 'center',
  },
  brandWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  brandName: {
    fontSize: 44,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
  brandAccent: {
    color: '#D32F2F',
  },
  underlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    width: 160,
    justifyContent: 'center',
  },
  underlineLine: {
    flex: 1,
    height: 2.5,
    backgroundColor: '#D32F2F',
    borderRadius: 2,
  },
  underlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D32F2F',
    marginHorizontal: 4,
  },
  tagline: {
    fontSize: 15,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 4,
  },
  landingFooter: {
    width: '100%',
    marginBottom: 16,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginLinkText: {
    color: '#555555',
    fontSize: 14,
    fontWeight: '500',
  },
  legalText: {
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 17,
    paddingBottom: 4,
  },
  legalLink: {
    color: '#888888',
    textDecorationLine: 'underline',
  },

  // ── Slides ──
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  slideDesc: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 21,
  },

  // ── Dots ──
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#D32F2F',
  },

  // ── Shared buttons ──
  slidesFooter: {
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  primaryBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
});
