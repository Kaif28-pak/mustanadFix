export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "customer" | "tech" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type BookingStatus =
  | "pending"
  | "assigned"
  | "on_the_way"
  | "job_started"
  | "completed"
  | "cancelled"
  | "disputed";
export type PaymentStatus = "pending" | "cash_on_delivery" | "paid" | "refunded";
export type BookingEventType =
  | "created"
  | "assigned"
  | "on_the_way"
  | "job_started"
  | "completed"
  | "cancelled"
  | "disputed";

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  phone: string | null;
  verified_status: VerificationStatus;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TechnicianProfile {
  profile_id: string;
  skills: string[];
  service_areas: string[];
  rating_avg: number;
  total_jobs: number;
  nadra_verified: boolean;
  police_cleared: boolean;
  cnic_last4: string | null;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  base_price: number;
  floor_surcharge_rate: number;
  is_active: boolean;
  created_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  label: string;
  full_address: string;
  area: string;
  floor_level: number;
  has_elevator: boolean;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  tech_id: string | null;
  service_id: string;
  address_id: string;
  issue_description: string;
  issue_image_url: string | null;
  calculated_floor_surcharge: number;
  total_amount: number;
  status: BookingStatus;
  cancellation_reason: string | null;
  payment_status: PaymentStatus;
  start_pin: string;
  scheduled_date: string;
  created_at: string;
  updated_at: string;

  // Joined relations
  service?: Service;
  address?: Address;
  customer?: Profile;
  technician?: Profile & { technician_profile?: TechnicianProfile };
}

export interface BookingEvent {
  id: string;
  booking_id: string;
  event_type: BookingEventType;
  created_by: string | null;
  notes: string | null;
  created_at: string;
}
