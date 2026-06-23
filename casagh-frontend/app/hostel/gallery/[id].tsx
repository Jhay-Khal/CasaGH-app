import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import { Text } from '../../../components/Text';

const IMAGES = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
  'https://images.unsplash.com/photo-1502672260266-1c1e52509def',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f',
  'https://images.unsplash.com/photo-1497366216548-37526070297c',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
];

export default function Gallery() {
  const [activeImg, setActiveImg] = useState<string | null>(null);

  if (activeImg) {
    return (
      <View style={styles.fullScreen}>
        <Pressable style={styles.closeBtn} onPress={() => setActiveImg(null)}>
          <Ionicons name="close" size={32} color="#fff" />
        </Pressable>
        <Image source={{ uri: activeImg }} style={styles.fullImage} resizeMode="contain" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.ink} />
        </Pressable>
        <Text variant="h1">Gallery</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {IMAGES.map((img, idx) => (
          <Pressable key={idx} style={styles.imgWrap} onPress={() => setActiveImg(img)}>
            <Image source={{ uri: img }} style={styles.thumbnail} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const gap = 4;
const itemSize = (width - gap * 3) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.sp4, paddingVertical: theme.spacing.sp3, borderBottomWidth: 1, borderBottomColor: theme.colors.line },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: gap },
  imgWrap: { width: itemSize, height: itemSize, margin: gap / 2, backgroundColor: theme.colors.green100, borderRadius: theme.radius.sm, overflow: 'hidden' },
  thumbnail: { width: '100%', height: '100%' },
  fullScreen: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  closeBtn: { position: 'absolute', top: 60, right: 20, zIndex: 10, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  fullImage: { width: '100%', height: '100%' },
});
