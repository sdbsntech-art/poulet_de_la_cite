import { View, Text, Image, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';

const COLORS = {
  brown: '#5C3D2E',
  brownDark: '#3D2817',
  orange: '#F97316',
  tan: '#D4A574',
  cream: '#FAF6F1',
  white: '#FFFFFF',
};

const GALLERY = [
  { src: require('../assets/gallery/01.jpg'), title: 'Élevage en plein air' },
  { src: require('../assets/gallery/02.jpg'), title: 'Habitat naturel' },
  { src: require('../assets/gallery/03.jpg'), title: 'Bien-être animal' },
  { src: require('../assets/gallery/04.jpg'), title: 'Qualité supérieure' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Le Poulailler</Text>
        <Text style={styles.subtitle}>Élevage d'Excellence depuis 2018</Text>
        <Text style={styles.desc}>
          Poulets de chair élevés en plein air avec passion et respect du bien-être animal.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Notre Galerie</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
        {GALLERY.map((item, i) => (
          <View key={i} style={styles.galleryCard}>
            <Image source={item.src} style={styles.galleryImg} resizeMode="cover" />
            <Text style={styles.galleryLabel}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          style={styles.btnPrimary}
          onPress={() => Linking.openURL('https://wa.me/221773624539')}
        >
          <Text style={styles.btnText}>WhatsApp — 77 362 45 39</Text>
        </Pressable>
        <Pressable
          style={styles.btnPrimary}
          onPress={() => Linking.openURL('https://wa.me/221764685865')}
        >
          <Text style={styles.btnText}>WhatsApp — 76 468 58 65</Text>
        </Pressable>
        <Pressable
          style={styles.btnPrimary}
          onPress={() => Linking.openURL('https://wa.me/221777941218')}
        >
          <Text style={styles.btnText}>WhatsApp — 77 794 12 18</Text>
        </Pressable>
        <Pressable
          style={styles.btnPrimary}
          onPress={() => Linking.openURL('https://wa.me/221785577229')}
        >
          <Text style={styles.btnText}>WhatsApp — 78 557 72 29</Text>
        </Pressable>
        <Pressable
          style={styles.btnSecondary}
          onPress={() => Linking.openURL('https://YOUR_SITE_URL')}
        >
          <Text style={styles.btnSecondaryText}>Voir le site complet</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  content: { paddingBottom: 40 },
  hero: {
    backgroundColor: COLORS.brown,
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: { width: 100, height: 100, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.white, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.orange, fontWeight: '600', marginBottom: 12 },
  desc: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.brown,
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },
  galleryScroll: { paddingLeft: 20 },
  galleryCard: {
    width: 180,
    marginRight: 14,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  galleryImg: { width: 180, height: 130 },
  galleryLabel: {
    padding: 10,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.brown,
    textAlign: 'center',
  },
  actions: { padding: 20, gap: 12 },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  btnSecondary: {
    borderWidth: 2,
    borderColor: COLORS.brown,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSecondaryText: { color: COLORS.brown, fontSize: 16, fontWeight: '600' },
});
