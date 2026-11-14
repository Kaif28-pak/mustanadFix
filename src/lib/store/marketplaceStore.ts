"use client";

import { Service, Booking, Profile, TechnicianProfile, BookingStatus } from "../supabase/database.types";
import { calculateDynamicPrice } from "../pricing/calculator";

// Seed Services for Karachi AC & Home Appliance Repair
export const INITIAL_SERVICES: Service[] = [
  {
    id: "srv-1",
    name: "AC Master Service & Jet Wash",
    slug: "ac-master-service",
    category: "ac_repair",
    description: "Deep chemical pressure jet spray, indoor blower cleaning, outdoor condenser coil wash, and amp diagnostic check.",
    base_price: 2500,
    floor_surcharge_rate: 200,
    is_active: true,
    created_at: "2026-11-14T10:00:00Z",
  },
  {
    id: "srv-2",
    name: "AC Refrigerant Gas Refill (R410A / R32)",
    slug: "ac-gas-refill",
    category: "ac_repair",
    description: "Nitrogen leak pressure testing, vacuum dehydration, and 100% genuine virgin refrigerant gas recharge.",
    base_price: 4500,
    floor_surcharge_rate: 250,
    is_active: true,
    created_at: "2026-11-14T10:00:00Z",
  },
  {
    id: "srv-3",
    name: "AC Inverter PCB Circuit Diagnostics",
    slug: "ac-inverter-pcb",
    category: "ac_repair",
    description: "Microprocessor circuitry repair, IPM module testing, outdoor communication sensor check, and voltage stabilization.",
    base_price: 3500,
    floor_surcharge_rate: 150,
    is_active: true,
    created_at: "2026-11-14T10:00:00Z",
  },
  {
    id: "srv-4",
    name: "Refrigerator & Freezer Cooling Restoration",
    slug: "fridge-cooling-fix",
    category: "refrigerator",
    description: "Thermostat calibration, sealed copper piping leak fix, gas charge, and compressor relay overhaul.",
    base_price: 4000,
    floor_surcharge_rate: 200,
    is_active: true,
    created_at: "2026-11-14T10:00:00Z",
  },
  {
    id: "srv-5",
    name: "Automatic Washing Machine Drum Service",
    slug: "washing-machine-drum",
    category: "washing_machine",
    description: "Spider bracket alignment, bearing & oil seal replacement, direct drive calibration, and drain pump flush.",
    base_price: 3200,
    floor_surcharge_rate: 150,
    is_active: true,
    created_at: "2026-11-14T10:00:00Z",
  },
];

// Seed Verified Technicians for Karachi
export interface VerifiedTechUser {
  profile: Profile;
  techProfile: TechnicianProfile;
}

export const INITIAL_TECHNICIANS: VerifiedTechUser[] = [
  {
    profile: {
      id: "tech-101",
      role: "tech",
      name: "Tariq Mehmood",
      phone: "+92 300 2849102",
      verified_status: "verified",
      avatar_url: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80",
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-10T10:00:00Z",
    },
    techProfile: {
      profile_id: "tech-101",
      skills: ["Inverter AC Specialist", "Gas Leak Testing", "Gree / Haier Certified"],
      service_areas: ["DHA Phase 5 & 6", "Clifton", "Zamzama"],
      rating_avg: 4.95,
      total_jobs: 342,
      nadra_verified: true,
      police_cleared: true,
      cnic_last4: "4921",
      is_online: true,
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-10T10:00:00Z",
    },
  },
  {
    profile: {
      id: "tech-102",
      role: "tech",
      name: "Muhammad Rizwan",
      phone: "+92 321 8934112",
      verified_status: "verified",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      created_at: "2024-02-15T10:00:00Z",
      updated_at: "2024-02-15T10:00:00Z",
    },
    techProfile: {
      profile_id: "tech-102",
      skills: ["PCB Circuit Repair", "Multi-Split VRF", "Dawlance Specialist"],
      service_areas: ["PECHS Block 2 & 6", "Bahadurabad", "Gulshan-e-Iqbal"],
      rating_avg: 4.90,
      total_jobs: 218,
      nadra_verified: true,
      police_cleared: true,
      cnic_last4: "8104",
      is_online: true,
      created_at: "2024-02-15T10:00:00Z",
      updated_at: "2024-02-15T10:00:00Z",
    },
  },
  {
    profile: {
      id: "tech-103",
      role: "tech",
      name: "Kamran Siddiqui",
      phone: "+92 333 4519022",
      verified_status: "pending",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      created_at: "2024-03-01T10:00:00Z",
      updated_at: "2024-03-01T10:00:00Z",
    },
    techProfile: {
      profile_id: "tech-103",
      skills: ["Heavy Compressor Brazing", "Chiller Diagnostics"],
      service_areas: ["Clifton Block 2 & 4", "DHA Phase 2"],
      rating_avg: 4.82,
      total_jobs: 94,
      nadra_verified: true,
      police_cleared: false, // In vetting queue
      cnic_last4: "1923",
      is_online: true,
      created_at: "2024-03-01T10:00:00Z",
      updated_at: "2024-03-01T10:00:00Z",
    },
  },
];

// Seed active booking demonstration
export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk-9001",
    customer_id: "cust-demo",
    tech_id: "tech-101",
    service_id: "srv-1",
    address_id: "addr-demo",
    issue_description: "1.5 Ton Inverter AC in Master Bedroom not cooling properly. Outdoor fan vibrating loudly.",
    issue_image_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    calculated_floor_surcharge: 320,
    total_amount: 2820,
    status: "on_the_way",
    cancellation_reason: null,
    payment_status: "pending",
    start_pin: "7492", // 4-digit secure handshake PIN
    scheduled_date: "2026-11-14T14:00:00Z",
    created_at: "2026-11-14T09:30:00Z",
    updated_at: "2026-11-14T09:55:00Z",
    service: INITIAL_SERVICES[0],
    address: {
      id: "addr-demo",
      customer_id: "cust-demo",
      label: "Apartment",
      full_address: "Apt 402, Creek Vistas Tower C, DHA Phase 8, Karachi",
      area: "DHA Phase 8",
      floor_level: 4,
      has_elevator: true,
      lat: 24.7831,
      lng: 67.0652,
      created_at: "2026-11-14T09:30:00Z",
    },
    technician: {
      ...INITIAL_TECHNICIANS[0].profile,
      technician_profile: INITIAL_TECHNICIANS[0].techProfile,
    },
  },
  {
    id: "bk-9002",
    customer_id: "cust-demo-2",
    tech_id: null, // Unassigned pending job available for techs
    service_id: "srv-2",
    address_id: "addr-demo-2",
    issue_description: "AC Gas completely empty after shifting from Gulshan. Need full vacuum and R410A charge.",
    issue_image_url: null,
    calculated_floor_surcharge: 500,
    total_amount: 5000,
    status: "pending",
    cancellation_reason: null,
    payment_status: "pending",
    start_pin: "3819",
    scheduled_date: "2026-11-14T16:00:00Z",
    created_at: "2026-11-14T09:45:00Z",
    updated_at: "2026-11-14T09:45:00Z",
    service: INITIAL_SERVICES[1],
    address: {
      id: "addr-demo-2",
      customer_id: "cust-demo-2",
      label: "Residence",
      full_address: "House 24-B, Main Khayaban-e-Shamsheer, DHA Phase 5, Karachi",
      area: "DHA Phase 5",
      floor_level: 2,
      has_elevator: false,
      lat: 24.8112,
      lng: 67.0451,
      created_at: "2026-11-14T09:45:00Z",
    },
  },
];

// Marketplace in-memory & local state manager
class MarketplaceStore {
  private bookings: Booking[] = [...INITIAL_BOOKINGS];
  private technicians: VerifiedTechUser[] = [...INITIAL_TECHNICIANS];
  private services: Service[] = [...INITIAL_SERVICES];
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      const savedBookings = localStorage.getItem("mustanad_bookings");
      if (savedBookings) {
        try {
          this.bookings = JSON.parse(savedBookings);
        } catch (e) {
          console.error("Failed to parse stored bookings", e);
        }
      }
    }
  }

  private persist() {
    if (typeof window !== "undefined") {
      localStorage.setItem("mustanad_bookings", JSON.stringify(this.bookings));
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getServices(): Service[] {
    return this.services;
  }

  public getTechnicians(): VerifiedTechUser[] {
    return this.technicians;
  }

  public getBookings(): Booking[] {
    return this.bookings;
  }

  public getActiveCustomerBooking(customerId: string = "cust-demo"): Booking | undefined {
    return this.bookings.find(
      (b) => b.customer_id === customerId && !["completed", "cancelled"].includes(b.status)
    );
  }

  public getAvailableJobsForTech(area?: string): Booking[] {
    return this.bookings.filter((b) => b.status === "pending" && b.tech_id === null);
  }

  public getAssignedJobsForTech(techId: string = "tech-101"): Booking[] {
    return this.bookings.filter((b) => b.tech_id === techId && b.status !== "completed");
  }

  // Create new booking (Atomic calculation enforced)
  public createBooking(data: {
    serviceId: string;
    issueDescription: string;
    issueImageUrl?: string | null;
    fullAddress: string;
    area: string;
    floorLevel: number;
    hasElevator: boolean;
    scheduledDate: string;
  }): Booking {
    const service = this.services.find((s) => s.id === data.serviceId) || this.services[0];
    const pricing = calculateDynamicPrice({
      basePrice: service.base_price,
      floorSurchargeRate: service.floor_surcharge_rate,
      floorLevel: data.floorLevel,
      hasElevator: data.hasElevator,
    });

    const newBookingId = `bk-${Date.now().toString().slice(-4)}`;
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

    const newBooking: Booking = {
      id: newBookingId,
      customer_id: "cust-demo",
      tech_id: null,
      service_id: service.id,
      address_id: `addr-${Date.now()}`,
      issue_description: data.issueDescription,
      issue_image_url: data.issueImageUrl || null,
      calculated_floor_surcharge: pricing.floorSurcharge,
      total_amount: pricing.totalAmount,
      status: "pending",
      cancellation_reason: null,
      payment_status: "pending",
      start_pin: randomPin,
      scheduled_date: data.scheduledDate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      service: service,
      address: {
        id: `addr-${Date.now()}`,
        customer_id: "cust-demo",
        label: "Primary Residence",
        full_address: data.fullAddress,
        area: data.area,
        floor_level: data.floorLevel,
        has_elevator: data.hasElevator,
        lat: 24.81,
        lng: 67.05,
        created_at: new Date().toISOString(),
      },
    };

    this.bookings = [newBooking, ...this.bookings];
    this.persist();
    return newBooking;
  }

  // Atomic Job Acceptance (Simulates PostgreSQL accept_job RPC)
  public acceptJob(bookingId: string, techId: string = "tech-101"): { success: boolean; message: string; booking?: Booking } {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, message: "Booking not found." };
    }
    if (booking.status !== "pending" || booking.tech_id !== null) {
      return { success: false, message: "Race condition prevented: This job has already been accepted by another technician." };
    }

    const tech = this.technicians.find((t) => t.profile.id === techId) || this.technicians[0];

    booking.tech_id = tech.profile.id;
    booking.status = "assigned";
    booking.technician = {
      ...tech.profile,
      technician_profile: tech.techProfile,
    };
    booking.updated_at = new Date().toISOString();

    this.persist();
    return { success: true, message: "Job accepted successfully! Address details unlocked.", booking };
  }

  // Set Tech On The Way
  public setTechOnTheWay(bookingId: string): boolean {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking && booking.status === "assigned") {
      booking.status = "on_the_way";
      booking.updated_at = new Date().toISOString();
      this.persist();
      return true;
    }
    return false;
  }

  // Verify 4-Digit Handshake PIN (Simulates PostgreSQL verify_job_pin RPC)
  public verifyJobPin(bookingId: string, inputPin: string): { success: boolean; message: string } {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, message: "Booking not found." };
    }
    if (booking.start_pin !== inputPin.trim()) {
      return { success: false, message: "Invalid 4-digit PIN! Please ask the customer to read the code displayed on their dashboard." };
    }

    booking.status = "job_started";
    booking.updated_at = new Date().toISOString();
    this.persist();
    return { success: true, message: "PIN verified successfully! Work is now officially started." };
  }

  // Complete Job (Simulates PostgreSQL complete_job RPC)
  public completeJob(bookingId: string): boolean {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking && booking.status === "job_started") {
      booking.status = "completed";
      booking.payment_status = "paid";
      booking.updated_at = new Date().toISOString();
      this.persist();
      return true;
    }
    return false;
  }

  // Cancel Booking
  public cancelBooking(bookingId: string, reason: string): boolean {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (booking && ["pending", "assigned"].includes(booking.status)) {
      booking.status = "cancelled";
      booking.cancellation_reason = reason;
      booking.updated_at = new Date().toISOString();
      this.persist();
      return true;
    }
    return false;
  }

  // Admin Vetting Toggle
  public toggleTechVetting(techId: string, field: "nadra" | "police"): boolean {
    const tech = this.technicians.find((t) => t.profile.id === techId);
    if (tech) {
      if (field === "nadra") {
        tech.techProfile.nadra_verified = !tech.techProfile.nadra_verified;
      } else {
        tech.techProfile.police_cleared = !tech.techProfile.police_cleared;
      }
      this.notify();
      return true;
    }
    return false;
  }
}

export const marketplace = new MarketplaceStore();
