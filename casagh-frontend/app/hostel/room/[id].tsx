import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Modal, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { theme } from '../../../theme';
import { Text } from '../../../components/Text';
import { Button } from '../../../components/Button';
import { getPropertyById } from '../../../services/api';
import { useAppAlert } from '../../context/AppAlertContext';

function formatDisplay(value: string): string {
  if (!value) return '';
  const date = new Date(value + 'T00:00:00');
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getTodayStr(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function RoomSelection() {
  const { id } = useLocalSearchParams();
  const { showAlert, showConfirm } = useAppAlert();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);

  const today = getTodayStr();

  useEffect(() => {
    loadProperty();
  }, [id]);

  async function loadProperty() {
    try {
      const data = await getPropertyById(Number(id));
      setProperty(data);
    } catch (error) {
      console.error('Failed to load property:', error);
      showAlert('Error', 'Could not load property details');
    } finally {
      setLoading(false);
    }
  }

  const isForRent = property?.isForRent !== false;

  const checkInDate = checkIn ? new Date(checkIn + 'T00:00:00') : null;
  const checkOutDate = checkOut ? new Date(checkOut + 'T00:00:00') : null;
  const nights =
    checkInDate && checkOutDate && checkOutDate > checkInDate
      ? Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice = property
    ? (isForRent ? nights * property.price : property.price)
    : 0;

  function openCalendarFor(field: 'checkIn' | 'checkOut') {
    setSelectingCheckIn(field === 'checkIn');
    setCalendarVisible(true);
  }

  function handleDayPress(day: { dateString: string }) {
    if (selectingCheckIn) {
      setCheckIn(day.dateString);
      if (checkOut && day.dateString >= checkOut) {
        setCheckOut('');
      }
      setSelectingCheckIn(false);
    } else {
      if (day.dateString <= checkIn) {
        showAlert('Invalid date', 'Check-out date must be after check-in date.');
        return;
      }
      setCheckOut(day.dateString);
      setCalendarVisible(false);
    }
  }

  function getMarkedDates() {
    const marked: Record<string, any> = {};
    if (checkIn) {
      marked[checkIn] = { startingDay: true, color: theme.colors.green700, textColor: '#fff' };
    }
    if (checkOut) {
      marked[checkOut] = { endingDay: true, color: theme.colors.green700, textColor: '#fff' };
    }
    if (checkIn && checkOut) {
      let current = new Date(checkIn + 'T00:00:00');
      const end = new Date(checkOut + 'T00:00:00');
      current.setDate(current.getDate() + 1);
      while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        marked[dateStr] = { color: theme.colors.green100, textColor: theme.colors.green900 };
        current.setDate(current.getDate() + 1);
      }
    }
    return marked;
  }

  function handleProceedRent() {
    if (!checkIn) {
      showAlert('Missing date', 'Please select a check-in date.');
      return;
    }
    if (!checkOut) {
      showAlert('Missing date', 'Please select a check-out date.');
      return;
    }
    if (checkOut <= checkIn) {
      showAlert('Invalid dates', 'Check-out date must be after check-in date.');
      return;
    }
    if (checkIn < today) {
      showAlert('Invalid date', 'Check-in date cannot be in the past.');
      return;
    }
    router.push({
      pathname: '/checkout',
      params: { propertyId: String(id), checkIn, checkOut },
    });
  }

  function handleProceedSale() {
    showConfirm({
      title: 'Confirm Purchase',
      message: `Proceed to buy "${property.title}" for ₵${property.price.toLocaleString()}? You'll message the host first to confirm details.`,
      confirmLabel: 'Proceed',
      onConfirm: () => {
        router.push({
          pathname: '/checkout',
          params: { propertyId: String(id) },
        });
      },
    });
  }

  if (loading) {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={theme.colors.green700} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.centerFill}>
        <Text variant="h3" color={theme.colors.inkSoft}>Property not found</Text>
        <Button label="Go Back" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Property summary */}
        <View style={styles.propertyCard}>
          <View style={styles.propertyIconWrap}>
            <Ionicons name="home" size={22} color={theme.colors.green700} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="h3">{property.title}</Text>
            <Text variant="bodySm" color={theme.colors.inkSoft}>
              {property.area}, {property.city}
            </Text>
          </View>
          <Text variant="h3" color={theme.colors.green700}>
            ₵{property.price.toLocaleString()}
            {isForRent && <Text variant="caption" color={theme.colors.inkSoft}>/night</Text>}
          </Text>
        </View>

        {isForRent ? (
          <>
            <Text variant="h2" style={{ marginTop: 28, marginBottom: 6 }}>Select your dates</Text>
            <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginBottom: 20 }}>
              Tap below to choose your check-in and check-out dates
            </Text>

            <Pressable style={styles.dateField} onPress={() => openCalendarFor('checkIn')}>
              <View>
                <Text variant="caption" color={theme.colors.inkSoft}>Check-in date</Text>
                <Text variant="bodyLg" color={checkIn ? theme.colors.ink : theme.colors.inkSoft}>
                  {checkIn ? formatDisplay(checkIn) : 'Select date'}
                </Text>
              </View>
              <Ionicons name="calendar-outline" size={22} color={theme.colors.green700} />
            </Pressable>

            <Pressable style={styles.dateField} onPress={() => openCalendarFor('checkOut')}>
              <View>
                <Text variant="caption" color={theme.colors.inkSoft}>Check-out date</Text>
                <Text variant="bodyLg" color={checkOut ? theme.colors.ink : theme.colors.inkSoft}>
                  {checkOut ? formatDisplay(checkOut) : 'Select date'}
                </Text>
              </View>
              <Ionicons name="calendar-outline" size={22} color={theme.colors.green700} />
            </Pressable>

            {nights > 0 && property && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text variant="bodyMd" color={theme.colors.inkSoft}>
                    ₵{property.price} × {nights} night{nights !== 1 ? 's' : ''}
                  </Text>
                  <Text variant="bodyMd">₵{totalPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text variant="h3">Total</Text>
                  <Text variant="h3" color={theme.colors.green700}>₵{totalPrice.toLocaleString()}</Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <View style={styles.saleNotice}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.green700} />
            <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginLeft: 10, flex: 1 }}>
              This property is for sale. Tap below to confirm your interest — you'll message the host to arrange next steps before payment.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={isForRent ? 'Proceed to Checkout' : `Buy for ₵${property.price.toLocaleString()}`}
          onPress={isForRent ? handleProceedRent : handleProceedSale}
        />
      </View>

      {/* Calendar Modal — rent only */}
      {isForRent && (
        <Modal visible={calendarVisible} transparent animationType="slide" onRequestClose={() => setCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text variant="h3" color="#0D1B4B">
                  {selectingCheckIn ? 'Select check-in date' : 'Select check-out date'}
                </Text>
                <Pressable onPress={() => setCalendarVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.inkSoft} />
                </Pressable>
              </View>
              <Calendar
                minDate={selectingCheckIn ? today : checkIn || today}
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={handleDayPress}
                theme={{
                  todayTextColor: theme.colors.green700,
                  arrowColor: theme.colors.green700,
                  selectedDayBackgroundColor: theme.colors.green700,
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.green50 },
  content: { padding: theme.spacing.sp4, paddingBottom: 120 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  propertyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  propertyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp4,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
    marginBottom: 12,
  },
  summaryCard: {
    marginTop: 20,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.sp5,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryDivider: { height: 1, backgroundColor: theme.colors.line, marginVertical: theme.spacing.sp3 },
  saleNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.green100,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sp4,
    marginTop: 24,
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: theme.spacing.sp4, backgroundColor: theme.colors.white,
    borderTopWidth: 1, borderTopColor: theme.colors.line,
    paddingBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 27, 75, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});