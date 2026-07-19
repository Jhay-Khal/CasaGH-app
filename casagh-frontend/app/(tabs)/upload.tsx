import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import { Text } from '../../components/Text';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { createProperty, uploadPropertyImage, uploadPropertyDocument, initiateListingPayment } from '../../services/api';

type PropertyType = 'APARTMENT' | 'HOSTEL' | 'HOUSE';

const ROOM_TYPES = ['1', '2', '3', '4'];
const AMENITIES = ['Air Conditioning', 'Wi-Fi included', 'Backup Generator', 'Study Room', 'Gym'];
const HOUSE_FEATURES = ['Swimming Pool', 'Garden', 'Garage', 'Boys Quarters', 'Security Post'];

function getPricingUnit(type: PropertyType, isForRent: boolean): string {
  if (!isForRent) return 'TOTAL';
  if (type === 'HOSTEL') return 'ACADEMIC_YEAR';
  return 'NIGHT'; // APARTMENT and HOUSE, for rent
}

function getPriceLabel(type: PropertyType, isForRent: boolean): string {
  const unit = getPricingUnit(type, isForRent);
  if (unit === 'NIGHT') return 'Price per night (₵)';
  if (unit === 'ACADEMIC_YEAR') return 'Price per academic year (₵)';
  return 'Price (₵)';
}

export default function UploadProperty() {
  const [checkingRole, setCheckingRole] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PropertyType>('APARTMENT');
  const [isForRent, setIsForRent] = useState(true);
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [document, setDocument] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [roomType, setRoomType] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    // Reset type-specific selections when property type changes,
    // since amenity/feature sets differ between hostel and house
    setAmenities(new Set());
    setRoomType(null);
  }, [type]);

  async function checkAccess() {
    try {
      const role = await AsyncStorage.getItem('userRole');
      const storedId = await AsyncStorage.getItem('userId');
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserEmail(user.email || '');
      }
      setIsOwner(role === 'OWNER');
      setUserId(storedId ? parseInt(storedId, 10) : null);
    } catch (error) {
      console.error('Failed to check access:', error);
    } finally {
      setCheckingRole(false);
    }
  }

  async function pickImages() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to add images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 6,
    });
    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris].slice(0, 6));
    }
  }

  async function pickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        setDocument(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not pick document. Please try again.');
    }
  }

  function removeImage(uri: string) {
    setImages((prev) => prev.filter((img) => img !== uri));
  }

  function toggleAmenity(a: string) {
    setAmenities((prev) => {
      const next = new Set(prev);
      next.has(a) ? next.delete(a) : next.add(a);
      return next;
    });
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setType('APARTMENT');
    setIsForRent(true);
    setPrice('');
    setRegion('');
    setCity('');
    setArea('');
    setImages([]);
    setDocument(null);
    setRoomType(null);
    setAmenities(new Set());
  }

  async function handleSubmit() {
    if (!userId) {
      Alert.alert('Error', 'Could not identify your account. Please log in again.');
      return;
    }
    if (!title || !description || !price || !region || !city || !area) {
      Alert.alert('Missing information', 'Please fill in all fields before submitting.');
      return;
    }
    if (!document) {
      Alert.alert('Document required', 'Please upload a property document (title deed, lease agreement, etc.) for verification.');
      return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid price', 'Please enter a valid price.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create the property (status: PENDING)
      const newProperty = await createProperty({
        ownerId: userId,
        title,
        description,
        type,
        price: numericPrice,
        isForRent,
        region,
        city,
        area,
        roomType: type === 'HOSTEL' ? roomType || undefined : undefined,
        pricingUnit: getPricingUnit(type, isForRent),
        amenities: Array.from(amenities),
      });

      // 2. Upload property images
      for (const uri of images) {
        try {
          await uploadPropertyImage(newProperty.id, uri);
        } catch (imgError) {
          console.error('Image upload failed for one photo:', imgError);
        }
      }

      // 3. Upload verification document
      try {
        await uploadPropertyDocument(newProperty.id, document);
      } catch (docError) {
        console.error('Document upload failed:', docError);
      }

      // 4. Navigate to listing fee payment
      router.push({
        pathname: '/checkout/listing-fee',
        params: {
          propertyId: newProperty.id,
          propertyTitle: title,
          email: userEmail,
        },
      });

      resetForm();
    } catch (error) {
      Alert.alert('Submission failed', 'Something went wrong while creating your listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingRole) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={theme.colors.teal700} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isOwner) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerFill}>
          <View style={styles.deniedIconWrap}>
            <Ionicons name="lock-closed-outline" size={36} color={theme.colors.teal700} />
          </View>
          <Text variant="h2" color={theme.colors.navy} style={{ marginTop: 16, textAlign: 'center' }}>
            Owners only
          </Text>
          <Text variant="bodyMd" color={theme.colors.inkSoft} style={{ textAlign: 'center', marginTop: 8, paddingHorizontal: 32 }}>
            Only property owners can list properties on CasaGH. Update your account to list a property.
          </Text>
          <Button
            label="Back to Home"
            variant="secondary"
            style={{ marginTop: 24 }}
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const showRoomAndAmenities = type === 'HOSTEL';
  const showHouseFeatures = type === 'HOUSE' && !isForRent;
  const priceLabel = getPriceLabel(type, isForRent);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color={theme.colors.navy} />
            </Pressable>
            <Text variant="h2" color={theme.colors.navy}>List a Property</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Verification Notice */}
          <View style={styles.noticeBox}>
            <Ionicons name="shield-checkmark" size={20} color={theme.colors.teal700} />
            <Text variant="bodySm" color={theme.colors.inkSoft} style={{ flex: 1, marginLeft: 10 }}>
              All listings require document verification and a ₵50/month listing fee. Your property will go live after admin approval.
            </Text>
          </View>

          {/* Photos */}
          <Text variant="h3" style={{ marginBottom: 10, marginTop: 16 }}>Photos</Text>
          <View style={styles.imageRow}>
            {images.map((uri) => (
              <View key={uri} style={styles.imageThumbWrap}>
                <Image source={{ uri }} style={styles.imageThumb} />
                <Pressable style={styles.removeImageBtn} onPress={() => removeImage(uri)}>
                  <Ionicons name="close" size={14} color={theme.colors.white} />
                </Pressable>
              </View>
            ))}
            {images.length < 6 && (
              <Pressable style={styles.addImageBtn} onPress={pickImages}>
                <Ionicons name="camera-outline" size={24} color={theme.colors.teal700} />
                <Text variant="caption" color={theme.colors.teal700} style={{ marginTop: 4 }}>
                  Add photo
                </Text>
              </Pressable>
            )}
          </View>

          {/* Property Document */}
          <Text variant="h3" style={{ marginTop: 24, marginBottom: 6 }}>Verification Document</Text>
          <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginBottom: 10 }}>
            Upload a title deed, lease agreement, or any document proving ownership.
          </Text>
          <Pressable style={styles.documentBtn} onPress={pickDocument}>
            <Ionicons
              name={document ? 'document-text' : 'document-attach-outline'}
              size={22}
              color={document ? theme.colors.teal700 : theme.colors.inkSoft}
            />
            <Text
              variant="bodyMd"
              color={document ? theme.colors.teal700 : theme.colors.inkSoft}
              style={{ marginLeft: 10, flex: 1 }}
            >
              {document ? document.name : 'Tap to upload document (PDF or image)'}
            </Text>
            {document && (
              <Pressable onPress={() => setDocument(null)}>
                <Ionicons name="close-circle" size={20} color={theme.colors.danger} />
              </Pressable>
            )}
          </Pressable>

          {/* Property Type */}
          <Text variant="h3" style={{ marginTop: 20, marginBottom: 10 }}>Property Type</Text>
          <View style={styles.chipRow}>
            {(['APARTMENT', 'HOSTEL', 'HOUSE'] as PropertyType[]).map((t) => (
              <Pressable
                key={t}
                style={[styles.typeChip, type === t && styles.typeChipActive]}
                onPress={() => setType(t)}
              >
                <Text
                  variant="bodySm"
                  color={type === t ? theme.colors.white : theme.colors.ink}
                  style={{ fontFamily: theme.fontFamily.bodySemiBold }}
                >
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Listing Type */}
          <Text variant="h3" style={{ marginTop: 20, marginBottom: 10 }}>Listing Type</Text>
          <View style={styles.chipRow}>
            <Pressable
              style={[styles.typeChip, isForRent && styles.typeChipActive]}
              onPress={() => setIsForRent(true)}
            >
              <Text variant="bodySm" color={isForRent ? theme.colors.white : theme.colors.ink}
                style={{ fontFamily: theme.fontFamily.bodySemiBold }}>
                For Rent
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeChip, !isForRent && styles.typeChipActive]}
              onPress={() => setIsForRent(false)}
            >
              <Text variant="bodySm" color={!isForRent ? theme.colors.white : theme.colors.ink}
                style={{ fontFamily: theme.fontFamily.bodySemiBold }}>
                For Sale
              </Text>
            </Pressable>
          </View>

          {/* Room Type + Amenities — HOSTEL only */}
          {showRoomAndAmenities && (
            <>
              <Text variant="h3" style={{ marginTop: 20, marginBottom: 10 }}>Room Type</Text>
              <View style={styles.chipRow}>
                {ROOM_TYPES.map((rt) => (
                  <Pressable
                    key={rt}
                    style={[styles.typeChip, roomType === rt && styles.typeChipActive]}
                    onPress={() => setRoomType(roomType === rt ? null : rt)}
                  >
                    <Text
                      variant="bodySm"
                      color={roomType === rt ? theme.colors.white : theme.colors.ink}
                      style={{ fontFamily: theme.fontFamily.bodySemiBold }}
                    >
                      {rt} in a room
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text variant="h3" style={{ marginTop: 20, marginBottom: 10 }}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {AMENITIES.map((a) => {
                  const checked = amenities.has(a);
                  return (
                    <Pressable key={a} style={styles.checkboxRow} onPress={() => toggleAmenity(a)}>
                      <Ionicons
                        name={checked ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={checked ? theme.colors.teal700 : theme.colors.inkSoft}
                      />
                      <Text variant="bodyMd" style={{ marginLeft: 10 }}>{a}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {/* Special Features — HOUSE for sale only */}
          {showHouseFeatures && (
            <>
              <Text variant="h3" style={{ marginTop: 20, marginBottom: 10 }}>Special Features</Text>
              <View style={styles.amenitiesGrid}>
                {HOUSE_FEATURES.map((f) => {
                  const checked = amenities.has(f);
                  return (
                    <Pressable key={f} style={styles.checkboxRow} onPress={() => toggleAmenity(f)}>
                      <Ionicons
                        name={checked ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={checked ? theme.colors.teal700 : theme.colors.inkSoft}
                      />
                      <Text variant="bodyMd" style={{ marginLeft: 10 }}>{f}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {/* Details */}
          <Text variant="h3" style={{ marginTop: 24, marginBottom: 10 }}>Details</Text>
          <Input label="Title" placeholder="e.g. 2 Bedroom Apartment in East Legon" value={title} onChangeText={setTitle} />
          <Input
            label="Description"
            placeholder="Describe the property..."
            value={description}
            onChangeText={setDescription}
            multiline
            style={{ height: 90, textAlignVertical: 'top' }}
          />
          <Input
            label={priceLabel}
            placeholder="e.g. 800"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          {/* Location */}
          <Text variant="h3" style={{ marginTop: 24, marginBottom: 10 }}>Location</Text>
          <Input label="Region" placeholder="e.g. Ashanti" value={region} onChangeText={setRegion} />
          <Input label="City" placeholder="e.g. Kumasi" value={city} onChangeText={setCity} />
          <Input label="Area" placeholder="e.g. Ayeduase" value={area} onChangeText={setArea} />

          {/* Listing Fee Notice */}
          <View style={styles.feeBox}>
            <Ionicons name="card-outline" size={18} color="#C9A84C" />
            <Text variant="bodySm" color={theme.colors.inkSoft} style={{ marginLeft: 8, flex: 1 }}>
              A listing fee of <Text variant="bodySm" color="#C9A84C" style={{ fontFamily: theme.fontFamily.bodyBold }}>₵50/month</Text> will be charged after submission via Paystack.
            </Text>
          </View>

          <Button
            label={submitting ? 'Submitting...' : 'Submit & Pay Listing Fee'}
            onPress={handleSubmit}
            disabled={submitting}
            style={{ marginTop: 20, marginBottom: 40 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.teal50 },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  content: { width: '100%', maxWidth: 480, paddingHorizontal: theme.spacing.sp4, paddingTop: 12 },
  centerFill: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  deniedIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: theme.colors.teal100,
    alignItems: 'center', justifyContent: 'center',
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.colors.white,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.line,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.teal100,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  imageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageThumbWrap: { width: 84, height: 84, borderRadius: theme.radius.md, overflow: 'hidden', position: 'relative' },
  imageThumb: { width: '100%', height: '100%' },
  removeImageBtn: {
    position: 'absolute', top: 4, right: 4,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  addImageBtn: {
    width: 84, height: 84, borderRadius: theme.radius.md,
    borderWidth: 1.5, borderColor: theme.colors.teal700,
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  documentBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 12, padding: 14,
    borderWidth: 1.5, borderColor: theme.colors.line,
    borderStyle: 'dashed',
  },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeChip: {
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: theme.radius.pill,
    borderWidth: 1.5, borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  typeChipActive: {
    backgroundColor: theme.colors.teal700,
    borderColor: theme.colors.teal700,
  },
  amenitiesGrid: { gap: 14 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  feeBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#FDF6E3',
    borderRadius: 12, padding: 14,
    marginTop: 20, gap: 4,
    borderWidth: 1, borderColor: '#C9A84C33',
  },
});