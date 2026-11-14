-- ====================================================================
-- MUSTANADFIX MVP - SUPABASE POSTGRESQL SCHEMA & SECURITY SPECIFICATION
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'tech', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'pending',
    'assigned',
    'on_the_way',
    'job_started',
    'completed',
    'cancelled',
    'disputed'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'cash_on_delivery', 'paid', 'refunded');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_event_type AS ENUM (
    'created',
    'assigned',
    'on_the_way',
    'job_started',
    'completed',
    'cancelled',
    'disputed'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  name TEXT NOT NULL,
  phone TEXT,
  verified_status verification_status NOT NULL DEFAULT 'unverified',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TECHNICIAN PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.technician_profiles (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  skills TEXT[] NOT NULL DEFAULT '{}',
  service_areas TEXT[] NOT NULL DEFAULT '{}', -- e.g., 'DHA', 'Clifton', 'PECHS', 'Gulshan'
  rating_avg NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
  total_jobs INTEGER NOT NULL DEFAULT 0,
  nadra_verified BOOLEAN NOT NULL DEFAULT FALSE,
  police_cleared BOOLEAN NOT NULL DEFAULT FALSE,
  cnic_last4 VARCHAR(4),
  is_online BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'ac_repair', 'refrigerator', 'washing_machine'
  description TEXT,
  base_price NUMERIC(10, 2) NOT NULL,
  floor_surcharge_rate NUMERIC(10, 2) NOT NULL DEFAULT 150.00, -- PKR per floor
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  full_address TEXT NOT NULL,
  area TEXT NOT NULL, -- e.g. 'DHA Phase 6', 'Clifton Block 2'
  floor_level INTEGER NOT NULL DEFAULT 0,
  has_elevator BOOLEAN NOT NULL DEFAULT TRUE,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  tech_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  address_id UUID NOT NULL REFERENCES public.addresses(id) ON DELETE RESTRICT,
  issue_description TEXT NOT NULL,
  issue_image_url TEXT,
  calculated_floor_surcharge NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status booking_status NOT NULL DEFAULT 'pending',
  cancellation_reason TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  start_pin VARCHAR(4) NOT NULL DEFAULT LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  scheduled_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BOOKING EVENTS (TIMELINE AUDIT)
CREATE TABLE IF NOT EXISTS public.booking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  event_type booking_event_type NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  tech_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DISPUTES TABLE
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'resolved'
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tech_id ON public.bookings(tech_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON public.addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_booking_events_booking_id ON public.booking_events(booking_id);

-- ====================================================================
-- DATABASE TRIGGERS & BUSINESS LOGIC
-- ====================================================================

-- A. Auto Profile Creation upon Auth Sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, phone, verified_status)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'name', 'Valued Customer'),
    NEW.phone,
    'unverified'
  );

  IF (NEW.raw_user_meta_data->>'role') = 'tech' THEN
    INSERT INTO public.technician_profiles (profile_id, skills, service_areas, cnic_last4)
    VALUES (
      NEW.id,
      ARRAY['General AC Repair']::TEXT[],
      ARRAY['DHA', 'Clifton']::TEXT[],
      '0000'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B. Server-Side Dynamic Price Calculation
CREATE OR REPLACE FUNCTION public.calculate_booking_pricing()
RETURNS TRIGGER AS $$
DECLARE
  v_base_price NUMERIC(10, 2);
  v_floor_rate NUMERIC(10, 2);
  v_floor_level INTEGER;
  v_has_elevator BOOLEAN;
  v_surcharge NUMERIC(10, 2) := 0.00;
BEGIN
  -- Get Service Pricing
  SELECT base_price, floor_surcharge_rate
  INTO v_base_price, v_floor_rate
  FROM public.services
  WHERE id = NEW.service_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid service_id specified';
  END IF;

  -- Get Address Floor Details
  SELECT floor_level, has_elevator
  INTO v_floor_level, v_has_elevator
  FROM public.addresses
  WHERE id = NEW.address_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid address_id specified';
  END IF;

  -- Floor Surcharge Logic:
  -- Ground floor (0) or below: 0 PKR
  -- With elevator: 40% of standard floor rate per floor
  -- Without elevator: 100% of standard floor rate per floor
  IF v_floor_level > 0 THEN
    IF v_has_elevator THEN
      v_surcharge := v_floor_level * (v_floor_rate * 0.40);
    ELSE
      v_surcharge := v_floor_level * v_floor_rate;
    END IF;
  ELSE
    v_surcharge := 0.00;
  END IF;

  NEW.calculated_floor_surcharge := ROUND(v_surcharge, 2);
  NEW.total_amount := ROUND(v_base_price + v_surcharge, 2);

  -- Ensure PIN is generated
  IF NEW.start_pin IS NULL OR LENGTH(NEW.start_pin) < 4 THEN
    NEW.start_pin := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_calculate_booking_pricing ON public.bookings;
CREATE TRIGGER trg_calculate_booking_pricing
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.calculate_booking_pricing();

-- C. Automatic Audit Event Logging on Booking Status Change
CREATE OR REPLACE FUNCTION public.log_booking_event_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.booking_events (booking_id, event_type, created_by, notes)
    VALUES (NEW.id, 'created', NEW.customer_id, 'Booking created by customer');
  ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.booking_events (booking_id, event_type, created_by, notes)
    VALUES (
      NEW.id,
      NEW.status::TEXT::booking_event_type,
      COALESCE(auth.uid(), NEW.tech_id, NEW.customer_id),
      CONCAT('Status updated from ', OLD.status, ' to ', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_booking_event ON public.bookings;
CREATE TRIGGER trg_log_booking_event
  AFTER INSERT OR UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.log_booking_event_on_status_change();

-- ====================================================================
-- ATOMIC RPCs (TRANSACTIONS)
-- ====================================================================

-- 1. Atomic Job Acceptance
CREATE OR REPLACE FUNCTION public.accept_job(p_booking_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_booking public.bookings;
  v_tech_role user_role;
BEGIN
  -- Verify caller role
  SELECT role INTO v_tech_role
  FROM public.profiles
  WHERE id = auth.uid();

  IF v_tech_role <> 'tech' THEN
    RAISE EXCEPTION 'Only registered technicians can accept bookings';
  END IF;

  -- Atomic update with row lock
  UPDATE public.bookings
  SET
    tech_id = auth.uid(),
    status = 'assigned',
    updated_at = NOW()
  WHERE id = p_booking_id
    AND status = 'pending'
    AND tech_id IS NULL
  RETURNING * INTO v_booking;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job is no longer available or has already been accepted';
  END IF;

  RETURN to_jsonb(v_booking);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Verify Job-Start PIN (Handshake)
CREATE OR REPLACE FUNCTION public.verify_job_pin(p_booking_id UUID, p_pin VARCHAR(4))
RETURNS JSONB AS $$
DECLARE
  v_booking public.bookings;
BEGIN
  SELECT * INTO v_booking
  FROM public.bookings
  WHERE id = p_booking_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  IF v_booking.tech_id <> auth.uid() THEN
    RAISE EXCEPTION 'You are not the assigned technician for this booking';
  END IF;

  IF v_booking.start_pin <> p_pin THEN
    RAISE EXCEPTION 'Incorrect 4-digit PIN. Please ask the customer for the verified code.';
  END IF;

  UPDATE public.bookings
  SET
    status = 'job_started',
    updated_at = NOW()
  WHERE id = p_booking_id
  RETURNING * INTO v_booking;

  RETURN to_jsonb(v_booking);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Complete Job
CREATE OR REPLACE FUNCTION public.complete_job(p_booking_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_booking public.bookings;
BEGIN
  UPDATE public.bookings
  SET
    status = 'completed',
    payment_status = 'paid',
    updated_at = NOW()
  WHERE id = p_booking_id
    AND tech_id = auth.uid()
    AND status = 'job_started'
  RETURNING * INTO v_booking;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unable to complete job. Ensure the job has been started.';
  END IF;

  RETURN to_jsonb(v_booking);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Public can view technician cards" ON public.profiles;
CREATE POLICY "Public can view technician cards"
  ON public.profiles FOR SELECT
  USING (role = 'tech');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND verified_status = (SELECT verified_status FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin full access profiles" ON public.profiles;
CREATE POLICY "Admin full access profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- Technician Profiles Policies
DROP POLICY IF EXISTS "Public view technician profiles" ON public.technician_profiles;
CREATE POLICY "Public view technician profiles"
  ON public.technician_profiles FOR SELECT
  TO PUBLIC USING (TRUE);

DROP POLICY IF EXISTS "Techs update own online status and areas" ON public.technician_profiles;
CREATE POLICY "Techs update own online status and areas"
  ON public.technician_profiles FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (
    auth.uid() = profile_id
    AND nadra_verified = (SELECT nadra_verified FROM public.technician_profiles WHERE profile_id = auth.uid())
    AND police_cleared = (SELECT police_cleared FROM public.technician_profiles WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin manage technician profiles" ON public.technician_profiles;
CREATE POLICY "Admin manage technician profiles"
  ON public.technician_profiles FOR ALL
  USING (public.is_admin());

-- Services Policies
DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read services"
  ON public.services FOR SELECT
  TO PUBLIC USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage services" ON public.services;
CREATE POLICY "Admin manage services"
  ON public.services FOR ALL
  USING (public.is_admin());

-- Addresses Policies
DROP POLICY IF EXISTS "Customers view and manage own addresses" ON public.addresses;
CREATE POLICY "Customers view and manage own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Assigned techs can view address" ON public.addresses;
CREATE POLICY "Assigned techs can view address"
  ON public.addresses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.address_id = addresses.id
        AND bookings.tech_id = auth.uid()
        AND bookings.status IN ('assigned', 'on_the_way', 'job_started', 'completed')
    )
  );

-- Bookings Policies
DROP POLICY IF EXISTS "Customer can view own bookings" ON public.bookings;
CREATE POLICY "Customer can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "Customer can insert booking" ON public.bookings;
CREATE POLICY "Customer can insert booking"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Tech can view available pending jobs" ON public.bookings;
CREATE POLICY "Tech can view available pending jobs"
  ON public.bookings FOR SELECT
  USING (
    status = 'pending'
    AND tech_id IS NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'tech'
    )
  );

DROP POLICY IF EXISTS "Tech can view accepted jobs" ON public.bookings;
CREATE POLICY "Tech can view accepted jobs"
  ON public.bookings FOR SELECT
  USING (tech_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Customer cancel own pending booking" ON public.bookings;
CREATE POLICY "Customer cancel own pending booking"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = customer_id AND status = 'pending')
  WITH CHECK (status = 'cancelled');

DROP POLICY IF EXISTS "Admin full access bookings" ON public.bookings;
CREATE POLICY "Admin full access bookings"
  ON public.bookings FOR ALL
  USING (public.is_admin());

-- Booking Events Policies
DROP POLICY IF EXISTS "Participants view events" ON public.booking_events;
CREATE POLICY "Participants view events"
  ON public.booking_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_events.booking_id
        AND (bookings.customer_id = auth.uid() OR bookings.tech_id = auth.uid())
    )
    OR public.is_admin()
  );

-- Reviews Policies
DROP POLICY IF EXISTS "Public view reviews" ON public.reviews;
CREATE POLICY "Public view reviews"
  ON public.reviews FOR SELECT
  TO PUBLIC USING (TRUE);

DROP POLICY IF EXISTS "Customer create review on completed job" ON public.reviews;
CREATE POLICY "Customer create review on completed job"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = customer_id
    AND EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = reviews.booking_id
        AND bookings.customer_id = auth.uid()
        AND bookings.status = 'completed'
    )
  );

-- Disputes Policies
DROP POLICY IF EXISTS "Booking participants create and view disputes" ON public.disputes;
CREATE POLICY "Booking participants create and view disputes"
  ON public.disputes FOR ALL
  USING (
    auth.uid() = opened_by
    OR public.is_admin()
  );

-- ====================================================================
-- STORAGE BUCKETS & POLICIES (Supabase Storage)
-- ====================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-issues',
  'booking-issues',
  TRUE,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Authenticated users upload issue images" ON storage.objects;
CREATE POLICY "Authenticated users upload issue images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'booking-issues' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Public read issue images" ON storage.objects;
CREATE POLICY "Public read issue images"
  ON storage.objects FOR SELECT
  TO PUBLIC
  USING (bucket_id = 'booking-issues');
