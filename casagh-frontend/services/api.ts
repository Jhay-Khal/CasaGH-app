const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';

// ─── Property Images by Type ───────────────────────────────────────────────
const PROPERTY_IMAGES: Record<string, string[]> = {
  HOSTEL: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800',
  ],
  APARTMENT: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  ],
  HOUSE: [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
  ],
};

export function getPropertyImage(type: string, id: number): string {
  const images = PROPERTY_IMAGES[type] || PROPERTY_IMAGES['HOSTEL'];
  return images[id % images.length];
}

// ─── Helper: extract a readable error message from a failed response ──────
async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data.message) return data.message;
    const firstKey = Object.keys(data)[0];
    if (firstKey && typeof data[firstKey] === 'string') return data[firstKey];
    return fallback;
  } catch {
    return fallback;
  }
}

// ─── Properties ───────────────────────────────────────────────────────────
export async function getProperties() {
  const res = await fetch(`${BASE_URL}/properties`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.content || []);
}

export async function getPropertyById(id: number) {
  const res = await fetch(`${BASE_URL}/properties/${id}`);
  if (!res.ok) throw new Error('Failed to fetch property');
  return res.json();
}

export async function getPropertiesByCity(city: string) {
  const res = await fetch(`${BASE_URL}/properties/city/${city}`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.content || []);
}

export async function getPropertiesByType(type: string) {
  const res = await fetch(`${BASE_URL}/properties/type/${type}`);
  if (!res.ok) throw new Error('Failed to fetch properties');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.content || []);
}

export async function createProperty(propertyData: {
  ownerId: number;
  title: string;
  description: string;
  type: 'APARTMENT' | 'HOSTEL' | 'HOUSE';
  price: number;
  isForRent: boolean;
  region: string;
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
}) {
  const res = await fetch(`${BASE_URL}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
  if (!res.ok) {
    const message = await extractErrorMessage(res, 'Failed to create property');
    throw new Error(message);
  }
  return res.json();
}

export async function uploadPropertyImage(propertyId: number, imageUri: string) {
  const formData = new FormData();
  const filename = imageUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const fileType = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('file', {
    uri: imageUri,
    name: filename,
    type: fileType,
  } as any);

  const res = await fetch(`${BASE_URL}/images/${propertyId}`, {
    method: 'POST',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!res.ok) {
    const message = await extractErrorMessage(res, 'Failed to upload image');
    throw new Error(message);
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const message = await extractErrorMessage(res, 'Login failed');
    throw new Error(message);
  }
  return res.json();
}

export async function register(
  fullName: string,
  email: string,
  password: string,
  phone: string,
  role: string = 'USER'
) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, phone, role }),
  });
  if (!res.ok) {
    const message = await extractErrorMessage(res, 'Registration failed');
    throw new Error(message);
  }
  return res.json();
}

// ─── Saved Properties ─────────────────────────────────────────────────────
export async function saveProperty(userId: number, propertyId: number) {
  const res = await fetch(`${BASE_URL}/saved/${userId}/${propertyId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to save property');
  return res.json();
}

export async function getSavedProperties(userId: number) {
  const res = await fetch(`${BASE_URL}/saved/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch saved properties');
  return res.json();
}

export async function unsaveProperty(userId: number, propertyId: number) {
  const res = await fetch(`${BASE_URL}/saved/${userId}/${propertyId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to unsave property');
}

// ─── Messages ─────────────────────────────────────────────────────────────
export async function sendMessage(
  senderId: number,
  receiverId: number,
  propertyId: number,
  content: string
) {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ senderId, receiverId, propertyId, content }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function getReceivedMessages(userId: number) {
  const res = await fetch(`${BASE_URL}/messages/received/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function getSentMessages(userId: number) {
  const res = await fetch(`${BASE_URL}/messages/sent/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch sent messages');
  return res.json();
}

// ─── Reviews ──────────────────────────────────────────────────────────────
export async function addReview(
  userId: number,
  propertyId: number,
  rating: number,
  comment: string
) {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, propertyId, rating, comment }),
  });
  if (!res.ok) throw new Error('Failed to add review');
  return res.json();
}

export async function getPropertyReviews(propertyId: number) {
  const res = await fetch(`${BASE_URL}/reviews/property/${propertyId}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

// ─── Notifications ────────────────────────────────────────────────────────
export async function getNotifications(userId: number) {
  const res = await fetch(`${BASE_URL}/notifications/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function getUnreadCount(userId: number) {
  const res = await fetch(`${BASE_URL}/notifications/${userId}/count`);
  if (!res.ok) throw new Error('Failed to fetch unread count');
  return res.json();
}

export async function markNotificationRead(notificationId: number) {
  const res = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

export async function markAllNotificationsRead(userId: number) {
  const res = await fetch(`${BASE_URL}/notifications/${userId}/read-all`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to mark all notifications as read');
}

// ─── Bookings ─────────────────────────────────────────────────────────────
export async function createBooking(
  propertyId: number,
  userId: number,
  checkInDate: string,
  checkOutDate: string
) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ propertyId, userId, checkInDate, checkOutDate }),
  });
  if (!res.ok) {
    const message = await extractErrorMessage(res, 'Failed to create booking');
    throw new Error(message);
  }
  return res.json();
}

export async function getBookingById(bookingId: number) {
  const res = await fetch(`${BASE_URL}/bookings/${bookingId}`);
  if (!res.ok) throw new Error('Failed to fetch booking');
  return res.json();
}

export async function getUserBookings(userId: number) {
  const res = await fetch(`${BASE_URL}/bookings/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function initiatePayment(bookingId: number) {
  const res = await fetch(`${BASE_URL}/bookings/${bookingId}/pay`, {
    method: 'POST',
  });
  if (!res.ok) {
    const message = await extractErrorMessage(res, 'Failed to start payment');
    throw new Error(message);
  }
  return res.json();
}

export async function verifyPayment(reference: string) {
  const res = await fetch(`${BASE_URL}/bookings/verify/${reference}`);
  if (!res.ok) throw new Error('Failed to verify payment');
  return res.json();
}

// ─── User Profile ─────────────────────────────────────────────────────────
export async function getUser(userId: number) {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateUser(userId: number, fullName: string, phone: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, phone }),
  });
  if (!res.ok) {
    const message = await extractErrorMessage(res, 'Failed to update profile');
    throw new Error(message);
  }
  return res.json();
}