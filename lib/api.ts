const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    role: string;
  }) =>
    apiRequest("/register/", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiRequest("/login/", { method: "POST", body: JSON.stringify(data) }),

  logout: () => apiRequest("/logout/", { method: "POST" }),

  getUser: () => apiRequest("/user/"),

  getTutors: () => apiRequest("/tutors/"),

  getSlots: (tutorId?: number) =>
    apiRequest(tutorId ? `/slots/?tutor_id=${tutorId}` : "/slots/"),

  createSlot: (data: { date: string; time: string; available: boolean }) =>
    apiRequest("/slots/", { method: "POST", body: JSON.stringify(data) }),

  updateSlot: (id: number, data: { available: boolean }) =>
    apiRequest(`/slots/${id}/`, { method: "PUT", body: JSON.stringify(data) }),

  deleteSlot: (id: number) => apiRequest(`/slots/${id}/`, { method: "DELETE" }),

  getBookings: () => apiRequest("/bookings/"),

  createBooking: (timeSlotId: number) =>
    apiRequest("/bookings/", {
      method: "POST",
      body: JSON.stringify({ time_slot: timeSlotId }),
    }),

  updateBooking: (id: number, data: { status?: string; paid?: boolean }) =>
    apiRequest(`/bookings/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  processPayment: (bookingId: number) =>
    apiRequest("/payment/", {
      method: "POST",
      body: JSON.stringify({ booking_id: bookingId }),
    }),

  getContacts: () => apiRequest("/contacts/"),

  getMessages: (contactId: number) =>
    apiRequest(`/messages/?contact_id=${contactId}`),

  sendMessage: (receiverId: number, text: string) =>
    apiRequest("/messages/", {
      method: "POST",
      body: JSON.stringify({ receiver: receiverId, text }),
    }),

  checkNewMessages: (contactId: number, lastId: number) =>
    apiRequest(`/messages/check/?contact_id=${contactId}&last_id=${lastId}`),

  addRating: (bookingId: number, score: number) =>
    apiRequest("/rating/", {
      method: "POST",
      body: JSON.stringify({ booking_id: bookingId, score }),
    }),
};
