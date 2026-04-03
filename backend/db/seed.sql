-- Clear existing data
TRUNCATE TABLE reservations RESTART IDENTITY CASCADE;
TRUNCATE TABLE rooms        RESTART IDENTITY CASCADE;
TRUNCATE TABLE users        RESTART IDENTITY CASCADE;

-- Sample rooms
INSERT INTO rooms (room_number, room_type, price_per_night, capacity, description) VALUES
('101', 'Standard Single',  89.00, 1, 'Cosy single room with city view, queen bed, en-suite bathroom and complimentary Wi-Fi.'),
('102', 'Standard Single',  89.00, 1, 'Quiet single room overlooking the courtyard garden. Includes desk, wardrobe and rainfall shower.'),
('201', 'Standard Double', 129.00, 2, 'Spacious double room with king bed, seating area and premium Nespresso machine.'),
('202', 'Standard Double', 129.00, 2, 'Double room with floor-to-ceiling windows, king bed and luxury Molton Brown toiletries.'),
('203', 'Superior Double', 159.00, 2, 'Superior double with partial river view, king bed, walk-in wardrobe and marble bathroom.'),
('301', 'Deluxe King',     199.00, 2, 'Deluxe room with panoramic city views, super-king bed, separate lounge area and Nespresso station.'),
('302', 'Deluxe King',     199.00, 2, 'Corner deluxe room with dual aspect views, super-king bed and complimentary evening canapes.'),
('401', 'Junior Suite',    289.00, 3, 'Junior suite with separate living room, king bedroom, dining table for two and butler service.'),
('402', 'Executive Suite', 389.00, 4, 'Two-room executive suite with full lounge, boardroom table, king bedroom and private terrace.'),
('501', 'Presidential',    599.00, 6, 'Two-bedroom presidential suite occupying the full top floor. Private terrace, jacuzzi, butler and chauffeur service included.');

-- Admin user (password: Admin@1234)
-- Hash generated with bcrypt rounds=10
INSERT INTO users (email, password_hash, role) VALUES
('admin@hotel.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');