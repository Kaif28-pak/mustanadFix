import { z } from "zod";

export const KARACHI_AREAS = [
  "Clifton (Blocks 1-9)",
  "DHA Phase 1 & 2",
  "DHA Phase 4 & 5 (Zamzama/Badar)",
  "DHA Phase 6 (Kh-e-Shujaat/Rahat)",
  "DHA Phase 7 & 8 (Creek / Seafront)",
  "PECHS (Blocks 2 & 6)",
  "Bahadurabad & Tariq Road",
  "Gulshan-e-Iqbal (Blocks 1-7)",
  "KDA Scheme 1 & Tipu Sultan",
] as const;

export const bookingFormSchema = z.object({
  serviceId: z.string().min(1, "Please select an AC or appliance service"),
  issueDescription: z
    .string()
    .min(10, "Please provide at least 10 characters describing the issue"),
  issueImageUrl: z.string().optional().nullable(),
  area: z.string().min(1, "Please select your neighborhood in Karachi"),
  fullAddress: z
    .string()
    .min(10, "Please provide apartment/house number and street name"),
  floorLevel: z
    .number()
    .int("Floor must be an integer")
    .min(0, "Floor cannot be negative")
    .max(50, "Max floor level is 50"),
  hasElevator: z.boolean().default(true),
  scheduledDate: z.string().min(1, "Please select a date"),
  scheduledTimeSlot: z.string().min(1, "Please select a time slot"),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export const pinVerificationSchema = z.object({
  pin: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d{4}$/, "PIN must contain only numbers"),
});

export type PinVerificationData = z.infer<typeof pinVerificationSchema>;
