import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '../../../theme';
import { Text } from '../../../components/Text';
import { Button } from '../../../components/Button';

const ROOMS = [
  { id: '1in', name: '1 in a room', price: 6500 },
  { id: '2in', name: '2 in a room', price: 4200 },
  { id: '3in', name: '3 in a room', price: 3500 },
  { id: '4in', name: '4 in a room', price: 2800 },
];

export default function RoomSelection() {
  const { id } = useLocalSearchParams();
  const [selected, setSelected] = useState('2in');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="bodyLg" color={theme.colors.inkSoft} style={{ marginBottom: 16 }}>
          Select your preferred room type for the academic year.
        </Text>

        {ROOMS.map((room) => {
          const isSelected = selected === room.id;
          return (
            <Pressable 
              key={room.id} 
              style={[styles.roomCard, isSelected && styles.roomCardSelected]}
              onPress={() => setSelected(room.id)}
            >
              <View>
                <Text variant="h3" color={isSelected ? theme.colors.green900 : theme.colors.ink}>{room.name}</Text>
                <Text variant="bodyMd" color={theme.colors.inkSoft}>Academic Year</Text>
              </View>
              <Text variant="h3" color={theme.colors.green700}>₵{room.price}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          label="Proceed to Checkout" 
          onPress={() => router.push('/checkout')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4, paddingBottom: 100 },
  roomCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp5,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.line,
    marginBottom: theme.spacing.sp4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  roomCardSelected: {
    borderColor: theme.colors.green700,
    backgroundColor: theme.colors.green50
  },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    padding: theme.spacing.sp4, backgroundColor: theme.colors.white,
    borderTopWidth: 1, borderTopColor: theme.colors.line,
    paddingBottom: 32
  }
});
