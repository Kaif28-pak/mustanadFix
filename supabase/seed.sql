-- SEED DATA FOR MUSTANADFIX MVP (KARACHI SERVICES)

INSERT INTO public.services (name, slug, category, description, base_price, floor_surcharge_rate) VALUES
('AC Master Service & Deep Wash', 'ac-master-service', 'ac_repair', 'Complete indoor & outdoor unit chemical jet wash, blower cleaning, drain flush, and amperage performance testing.', 2500.00, 200.00),
('AC Refrigerant Gas Refill (R410A / R32 / R22)', 'ac-gas-refill', 'ac_repair', 'Nitrogen pressure leak detection, electronic vacuum dehydration, and genuine virgin refrigerant recharge.', 4500.00, 250.00),
('AC Inverter Circuit PCB Diagnostic & Repair', 'ac-inverter-pcb', 'ac_repair', 'Advanced microcontroller troubleshooting, sensor replacement, power fluctuation protection check.', 3500.00, 150.00),
('AC Compressor Replacement & Valve Tuning', 'ac-compressor-replacement', 'ac_repair', 'Heavy compressor installation, copper tube brazing, capacitor replacement, and 3-hour load test.', 8500.00, 350.00),
('Refrigerator / Deep Freezer Cooling Repair', 'fridge-cooling-fix', 'refrigerator', 'Thermostat calibration, fan motor replacement, sealed system gas recharge, and frost troubleshooting.', 4000.00, 200.00),
('Automatic Washing Machine Drum & Motor Service', 'washing-machine-motor', 'washing_machine', 'Drum spider alignment, bearing & seal replacement, clutch gear repair, and vibration damping calibration.', 3200.00, 150.00)
ON CONFLICT (slug) DO UPDATE
SET base_price = EXCLUDED.base_price,
    floor_surcharge_rate = EXCLUDED.floor_surcharge_rate;
