-- =====================================================================
-- FEASTORA: Comprehensive Sample Seed Data
-- =====================================================================
USE feastora_db;

-- 1. ROLES
INSERT INTO roles (id, role_name, description) VALUES
(1, 'CUSTOMER', 'Standard consumer ordering food'),
(2, 'ADMIN', 'Super administrator with full platform control')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 2. USERS
-- Admin Password: Admin@Feastora2026 (BCrypt hash)
-- Customer Password: Password@123 (BCrypt hash)
-- Hash generated with standard BCrypt 10 rounds:
-- $2a$10$wTf7i1Q4RqmJzY95gLhL8OK9xGq06uG8W5Fm4Pj4.V88/wF4/3xO.
-- We also supply an alternative standard hash compatible with jbcrypt
INSERT INTO users (id, role_id, full_name, email, phone, password_hash, avatar_url, is_active) VALUES
(1, 2, 'Feastora Admin', 'admin@feastora.com', '+91 9876543210', '$2a$10$j8dEfZiIeCq0Yq93Y.5lbeZ8gG9aI7wS3C1Esm34lVvXzG4Tf0O3G', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', TRUE),
(2, 1, 'Rahul Sharma', 'rahul.sharma@example.com', '+91 9845012345', '$2a$10$wTf7i1Q4RqmJzY95gLhL8OK9xGq06uG8W5Fm4Pj4.V88/wF4/3xO.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80', TRUE),
(3, 1, 'Priya Patel', 'priya.patel@example.com', '+91 9741023456', '$2a$10$wTf7i1Q4RqmJzY95gLhL8OK9xGq06uG8W5Fm4Pj4.V88/wF4/3xO.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80', TRUE),
(4, 1, 'Anand Kumar', 'anand.kumar@example.com', '+91 9900134567', '$2a$10$wTf7i1Q4RqmJzY95gLhL8OK9xGq06uG8W5Fm4Pj4.V88/wF4/3xO.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 3. USER ADDRESSES
INSERT INTO user_addresses (id, user_id, recipient_name, phone, address_line, landmark, city, state, postal_code, address_type, is_default) VALUES
(1, 2, 'Rahul Sharma', '+91 9845012345', '#42, 4th Cross, 100ft Road, Indiranagar', 'Near Metro Pillar 88', 'Bengaluru', 'Karnataka', '560038', 'HOME', TRUE),
(2, 2, 'Rahul Sharma', '+91 9845012345', 'Prestige Tech Park, Tower B, 3rd Floor, Marathahalli-Sarjapur ORR', 'Kadubeesanahalli', 'Bengaluru', 'Karnataka', '560103', 'WORK', FALSE),
(3, 3, 'Priya Patel', '+91 9741023456', 'Flat 302, Green Meadows, 2nd Main, T. Nagar', 'Opposite Panagal Park', 'Chennai', 'Tamil Nadu', '600017', 'HOME', TRUE),
(4, 4, 'Anand Kumar', '+91 9900134567', 'Villa 14, Royal Palm Enclave, Nazarbad', 'Near Mysore Zoo', 'Mysore', 'Karnataka', '570010', 'HOME', TRUE)
ON DUPLICATE KEY UPDATE city=VALUES(city);

-- 4. FOOD CATEGORIES (20 Required Categories)
INSERT INTO food_categories (id, name, slug, image_url, description, display_order, is_active) VALUES
(1, 'South Indian', 'south-indian', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80', 'Crispy dosas, fluffy idlis, and authentic filter coffee', 1, TRUE),
(2, 'North Indian', 'north-indian', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', 'Rich gravies, paneer specialties, butter naans, and dal makhani', 2, TRUE),
(3, 'Tamil Nadu Special', 'tamil-nadu-special', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=400&q=80', 'Chettinad curries, Kothu Parotta, Pongal, and Madurai specials', 3, TRUE),
(4, 'Karnataka Special', 'karnataka-special', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80', 'Bisi Bele Bath, Davangere Benne Dosa, Mysore Pak, and Neer Dosa', 4, TRUE),
(5, 'Kerala Special', 'kerala-special', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80', 'Appam with stew, Malabar Parotta, coconut seafood curries', 5, TRUE),
(6, 'Andhra Special', 'andhra-special', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', 'Fiery Andhra gun powder meals, Gongura chicken, and spicy biryanis', 6, TRUE),
(7, 'Chinese', 'chinese', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80', 'Hakka noodles, Manchurian, fried rice, and dim sums', 7, TRUE),
(8, 'Italian', 'italian', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80', 'Artisanal pasta, creamy risottos, lasagna, and garlic bread', 8, TRUE),
(9, 'Fast Food', 'fast-food', 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&q=80', 'Crispy fries, rolls, loaded sandwiches, and quick bites', 9, TRUE),
(10, 'Biryani', 'biryani', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80', 'Fragrant dum biryanis, Ambur, Thalassery, and Hyderabadi delights', 10, TRUE),
(11, 'Pizza', 'pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', 'Woodfired sourdough, loaded cheese, and gourmet hand-tossed pizzas', 11, TRUE),
(12, 'Burger', 'burger', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', 'Juicy grilled patties, crispy chicken, and artisanal brioche buns', 12, TRUE),
(13, 'Cakes and Desserts', 'cakes-and-desserts', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', 'Belgian chocolate truffle, cheesecakes, brownies, and pastries', 13, TRUE),
(14, 'Ice Cream', 'ice-cream', 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80', 'Creamy sundaes, exotic fruit gelato, kulfi, and waffle cones', 14, TRUE),
(15, 'Fresh Juices', 'fresh-juices', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80', 'Cold-pressed natural juices, detox coolers, and sugarcane elixir', 15, TRUE),
(16, 'Milkshakes', 'milkshakes', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80', 'Thick Oreo, KitKat, Ferrero Rocher, and fruit milkshakes', 16, TRUE),
(17, 'Beverages', 'beverages', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80', 'Traditional filter coffee, masala chai, cold brew, and iced teas', 17, TRUE),
(18, 'Healthy Food', 'healthy-food', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', 'Quinoa bowls, fresh organic salads, sprout chaats, and protein wraps', 18, TRUE),
(19, 'Street Food', 'street-food', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80', 'Pani puri, pav bhaji, samosa chaat, and vada pav', 19, TRUE),
(20, 'Snacks', 'snacks', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80', 'Crunchy bajji, bonda, pakoras, mixture, and evening savories', 20, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. RESTAURANTS (Bangalore, Chennai, Tamil Nadu, Karnataka)
INSERT INTO restaurants (id, name, slug, description, image_url, banner_url, location, city, address, rating, rating_count, delivery_time_min, delivery_time_max, cuisine, delivery_fee, cost_for_two, opening_time, closing_time, is_open, is_featured) VALUES
(1, 'Mavalli Tiffin Room (MTR)', 'mtr-bangalore', 'Legendary 100-year-old heritage restaurant world-famous for Rava Idli, pure ghee Masala Dosa, and royal filter coffee.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 'Lalbagh Road', 'Bengaluru', '#14, Lalbagh Road, Mavalli, Bengaluru - 560004', 4.8, 4820, 20, 35, 'South Indian, Karnataka Heritage', 35.00, 350.00, '06:30:00', '22:00:00', TRUE, TRUE),
(2, 'Vidyarthi Bhavan', 'vidyarthi-bhavan', 'Iconic Gandhi Bazaar institution serving thick golden crispy Benne Masala Dosas with signature green chutney since 1943.', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', 'Gandhi Bazaar, Basavanagudi', 'Bengaluru', '#32, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru - 560004', 4.7, 5600, 25, 40, 'South Indian, Traditional Dosas', 30.00, 250.00, '06:30:00', '20:30:00', TRUE, TRUE),
(3, 'CTR (Shri Sagar)', 'ctr-shri-sagar', 'Malleshwaram landmark famed across the nation for buttery Benne Masala Dosa and fluffy Uddina Vada.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80', 'Malleshwaram', 'Bengaluru', '7th Cross, Margosa Road, Malleshwaram, Bengaluru - 560003', 4.9, 6200, 20, 30, 'South Indian, Karnataka Special', 25.00, 250.00, '07:00:00', '21:30:00', TRUE, TRUE),
(4, 'The Rameshwaram Cafe', 'the-rameshwaram-cafe', 'Quick-service South Indian sensation known for piping hot Ghee Podi Idli, Open Butter Dosa, and Filter Kaapi.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80', 'Indiranagar', 'Bengaluru', '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560008', 4.6, 7300, 15, 30, 'South Indian, Fast Casual', 40.00, 300.00, '06:00:00', '01:00:00', TRUE, TRUE),
(5, 'Meghana Foods', 'meghana-foods', 'The undisputed king of spicy Andhra style Biryanis, Boneless Chicken Biryani, and Paneer 65.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80', 'Koramangala 5th Block', 'Bengaluru', 'Near Jyoti Nivas College, Koramangala 5th Block, Bengaluru - 560095', 4.7, 9800, 30, 45, 'Biryani, Andhra Special, North Indian', 45.00, 600.00, '11:00:00', '23:30:00', TRUE, TRUE),
(6, 'Empire Restaurant', 'empire-restaurant', 'Bangalore’s beloved late-night dining empire, famed for Empire Special Ghee Rice, Chicken Kebab, and Coin Parotta.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80', 'Church Street', 'Bengaluru', '#36, Church Street, Off Brigade Road, Bengaluru - 560001', 4.4, 6100, 25, 40, 'North Indian, Biryani, Mughlai', 40.00, 550.00, '11:00:00', '02:00:00', TRUE, FALSE),
(7, 'Nagarjuna Andhra Meals', 'nagarjuna-andhra-meals', 'Signature banana leaf Andhra meals with piping hot gun powder, gongura pickle, spicy mutton vepudu, and curd.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 'Residency Road', 'Bengaluru', '#44/1, Residency Road, Near Galaxy Theatre, Bengaluru - 560025', 4.6, 3900, 30, 45, 'Andhra Special, South Indian, Meals', 40.00, 650.00, '12:00:00', '22:45:00', TRUE, FALSE),
(8, 'Truffles Burgers & Shakes', 'truffles-bangalore', 'Bangalore youth cult favorite serving gourmet handcrafted monster burgers, steak, and decadent milkshakes.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80', 'St. Marks Road', 'Bengaluru', '#28, St. Marks Road, Shanthala Nagar, Ashok Nagar, Bengaluru - 560001', 4.8, 8500, 25, 40, 'Burger, Fast Food, Milkshakes, Italian', 35.00, 500.00, '11:00:00', '23:00:00', TRUE, TRUE),
(9, 'Brahmin\'s Coffee Bar', 'brahmins-coffee-bar', 'Melt-in-mouth steaming Idlis, crispy Vada bathed in spicy coconut chutney, and authentic aromatic Filter Coffee.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', 'Shankarapura', 'Bengaluru', 'Near Shankar Mutt, Ranga Rao Road, Shankarapura, Bengaluru - 560004', 4.9, 4300, 15, 25, 'South Indian, Breakfast, Beverages', 20.00, 150.00, '06:00:00', '19:00:00', TRUE, FALSE),
(10, 'Saravana Bhavan', 'saravana-bhavan-chennai', 'The international gold standard for traditional Tamil vegetarian delicacies, Ghee Roast Dosa, and Mini Tiffin.', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 'T. Nagar', 'Chennai', '#19, Usman Road, T. Nagar, Chennai - 600017', 4.6, 5100, 20, 35, 'South Indian, Tamil Nadu Special, Pure Veg', 35.00, 350.00, '06:30:00', '22:30:00', TRUE, TRUE),
(11, 'Murugan Idli Shop', 'murugan-idli-shop-chennai', 'Pillow-soft hot idlis served with four distinct varieties of fresh homemade chutneys and spicy podi.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80', 'Besant Nagar', 'Chennai', '46, 6th Avenue, Besant Nagar, Chennai - 600090', 4.7, 4900, 20, 35, 'South Indian, Tamil Nadu Special', 30.00, 300.00, '07:00:00', '22:30:00', TRUE, TRUE),
(12, 'Ratna Cafe', 'ratna-cafe-chennai', 'Famous Triplicane landmark since 1948 known for drowning crispy hot idlis in rich, piping sambar.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80', 'Triplicane', 'Chennai', '#255, Triplicane High Road, Chennai - 600005', 4.5, 3400, 25, 40, 'South Indian, Tamil Nadu Special', 30.00, 250.00, '07:00:00', '21:30:00', TRUE, FALSE),
(13, 'Buhari 1937', 'buhari-chennai', 'The legendary birthplace of the worldwide sensation "Chicken 65", serving authentic Buhari Dum Biryani since 1937.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80', 'Mount Road', 'Chennai', '#83, Anna Salai, Triplicane, Chennai - 600002', 4.6, 5700, 30, 45, 'Biryani, Non-Veg, Mughlai, Fast Food', 45.00, 600.00, '11:00:00', '23:30:00', TRUE, TRUE),
(14, 'Junior Kuppanna', 'junior-kuppanna-chennai', 'Quintessential Kongu Nadu non-veg feast: tender Mutton Pallipalayam, Chettinad Biryani, and Egg Veechu Parotta.', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80', 'Anna Nagar', 'Chennai', '2nd Avenue, Block Z, Anna Nagar, Chennai - 600040', 4.6, 4200, 30, 45, 'Tamil Nadu Special, Kongu Style, Biryani', 40.00, 650.00, '11:30:00', '23:00:00', TRUE, TRUE),
(15, 'Hotel Vinayaka Mylari', 'hotel-vinayaka-mylari-mysore', 'The crown jewel of Mysore: feather-soft butter dosas with unique sagu and fresh white butter atop.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 'Nazarbad', 'Mysore', '#79, Shop No 2, Nazarbad Main Rd, Mysore - 570010', 4.9, 5800, 20, 35, 'Karnataka Special, South Indian', 25.00, 200.00, '06:30:00', '21:00:00', TRUE, TRUE),
(16, 'Sri Krishna Udupi Tiffin', 'sri-krishna-udupi', 'Traditional Udupi satvik thali, crispy Mangalore Buns, Goli Baje, and authentic Neer Dosa with coconut chutney.', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80', 'Car Street', 'Udupi', 'Near Sri Krishna Temple, Car Street, Udupi - 576101', 4.8, 3800, 20, 35, 'Karnataka Special, South Indian, Pure Veg', 25.00, 250.00, '06:30:00', '21:30:00', TRUE, FALSE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 6. FOOD ITEMS (Sample Menu)
INSERT INTO food_items (id, restaurant_id, category_id, name, description, image_url, price, discount_percentage, is_veg, is_available, is_bestseller, stock_quantity, preparation_time_min) VALUES
-- MTR (Restaurant 1)
(1, 1, 1, 'MTR Special Rava Idli', 'The world-famous invention of MTR. Steamed semolina cakes spiced with mustard, cashews, coriander and topped with pure ghee.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80', 75.00, 10, TRUE, TRUE, TRUE, 80, 12),
(2, 1, 1, 'Pure Ghee Masala Dosa', 'Golden crisp dosa roasted in aromatic desi ghee, stuffed with seasoned potato palya and served with red chutney & sambar.', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=500&q=80', 110.00, 0, TRUE, TRUE, TRUE, 120, 15),
(3, 1, 4, 'Bisi Bele Bath', 'Authentic Karnataka spicy rice lentil mash slow-cooked with fresh seasonal vegetables and dollops of melted ghee.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80', 95.00, 15, TRUE, TRUE, TRUE, 65, 10),
(4, 1, 17, 'Degree Filter Coffee', 'Freshly brewed aromatic chicory-blended filter coffee served frothy in traditional brass dabarah and tumbler.', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=500&q=80', 40.00, 0, TRUE, TRUE, TRUE, 200, 5),

-- Vidyarthi Bhavan (Restaurant 2)
(5, 2, 4, 'VB Classic Benne Masala Dosa', 'Thick, crunchy on the outside, spongy on the inside, roasted with generous butter and served with thick mint-coconut chutney.', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=500&q=80', 90.00, 10, TRUE, TRUE, TRUE, 150, 15),
(6, 2, 1, 'Crispy Medu Vada (2 Pcs)', 'Deep-fried crispy urad dal fritters with peppercorns, curry leaves, and green chillies.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80', 60.00, 0, TRUE, TRUE, FALSE, 90, 8),
(7, 2, 13, 'Kesari Bath (Pineapple)', 'Traditional semolina sweet pudding infused with saffron, roasted cashews, raisins, and juicy pineapple cubes.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80', 55.00, 0, TRUE, TRUE, FALSE, 70, 5),

-- Meghana Foods (Restaurant 5)
(8, 5, 10, 'Meghana Special Chicken Biryani', 'Our legendary boneless succulent chicken cubes tossed in spicy Andhra masala layered over fragrant basmati rice.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80', 340.00, 15, FALSE, TRUE, TRUE, 110, 20),
(9, 5, 6, 'Andhra Chilli Chicken', 'Crispy chicken morsels tossed with green chillies, garlic, curry leaves, and spicy house Andhra sauce.', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80', 290.00, 10, FALSE, TRUE, TRUE, 75, 15),
(10, 5, 10, 'Paneer 65 Biryani', 'Fresh cottage cheese cubes marinated in spicy herbs, fried crisp, and steamed with fragrant biryani rice.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80', 280.00, 10, TRUE, TRUE, TRUE, 60, 20),

-- Truffles (Restaurant 8)
(11, 8, 12, 'All American Cheese Burger', 'Juicy grilled patty topped with melted cheddar, crisp lettuce, tomato, caramelized onions, and signature garlic mayo.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80', 260.00, 10, FALSE, TRUE, TRUE, 85, 18),
(12, 8, 12, 'Crispy Veg Whopper Burger', 'Crispy spiced vegetable & corn patty with melted cheese slice, tangy pickles, and chipotle dressing in toasted brioche.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80', 210.00, 0, TRUE, TRUE, TRUE, 90, 15),
(13, 8, 16, 'Ferrero Rocher Thick Shake', 'Rich creamy blend of Italian hazelnut chocolate, Belgian chocolate ice cream, and crunchy wafer chunks.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80', 190.00, 0, TRUE, TRUE, TRUE, 100, 8),
(14, 8, 9, 'Peri Peri Crinkle Fries', 'Golden crinkle-cut potatoes dusted with zesty African bird’s eye chili seasoning with garlic aioli dip.', 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=500&q=80', 140.00, 5, TRUE, TRUE, FALSE, 120, 10),

-- Saravana Bhavan Chennai (Restaurant 10)
(15, 10, 1, 'Saravana Special Ghee Roast Dosa', 'Paper-thin golden crispy cone dosa generously drenched in pure cow ghee, served with 3 chutney varieties & sambar.', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=500&q=80', 125.00, 10, TRUE, TRUE, TRUE, 140, 12),
(16, 10, 3, 'Mini Tiffin Platter', 'Delightful combo of 1 Mini Masala Dosa, 2 Steamed Idlis, 1 Crispy Medu Vada, Rava Kesari, and Filter Coffee.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80', 185.00, 15, TRUE, TRUE, TRUE, 85, 10),
(17, 10, 3, 'Madras Sambar Vada (2 Pcs)', 'Fresh crispy lentil donuts soaked completely in tangy shallot & drumstick Madras sambar with finely chopped onions.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80', 80.00, 0, TRUE, TRUE, TRUE, 95, 5),

-- Junior Kuppanna (Restaurant 14)
(18, 14, 3, 'Mutton Pallipalayam', 'Signature Kongu Nadu speciality: tender baby goat cooked with shallots, dry red chillies, and fresh coconut slivers.', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80', 390.00, 10, FALSE, TRUE, TRUE, 60, 20),
(19, 14, 3, 'Egg Veechu Parotta', 'Thin flaky layered parotta beaten on hot tawa and folded with beaten egg, onions, and spicy salna.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80', 110.00, 0, FALSE, TRUE, TRUE, 95, 12),
(20, 14, 10, 'Kongu Seeraga Samba Biryani', 'Traditional small-grain aromatic Seeraga Samba rice cooked with tender meat, fresh herbs, and mild Kongu spices.', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80', 360.00, 10, FALSE, TRUE, TRUE, 80, 20),

-- Hotel Vinayaka Mylari Mysore (Restaurant 15)
(21, 15, 4, 'Mylari Special Butter Masala Dosa', 'Unbelievably soft and cloud-like dosa, smeared with secret onion-coriander sagu and dollops of fresh white butter.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80', 80.00, 0, TRUE, TRUE, TRUE, 180, 10),
(22, 15, 4, 'Authentic Mysore Pak', 'Heritage royal dessert made with gram flour, clarified butter, and sugar that melts into your mouth instantaneously.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80', 90.00, 0, TRUE, TRUE, TRUE, 120, 5),

-- Fresh Juices and Desserts
(23, 4, 15, 'Pure Alphonso Mango Juice', 'Thick chilled nectar squeezed from handpicked Ratnagiri Alphonso mangoes without artificial preservatives.', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80', 120.00, 10, TRUE, TRUE, TRUE, 90, 5),
(24, 8, 14, 'Belgian Dark Chocolate Sundae', 'Decadent double scoops of 70% dark cocoa gelato topped with hot fudge sauce and roasted almonds.', 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80', 160.00, 0, TRUE, TRUE, TRUE, 70, 8)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 7. FOOD CUSTOMIZATIONS
INSERT INTO food_customizations (id, food_item_id, name, additional_price, is_required, customization_type) VALUES
(1, 2, 'Extra Desi Ghee Dollop', 20.00, FALSE, 'ADD_ON'),
(2, 2, 'Extra Coconut & Red Chutney', 15.00, FALSE, 'ADD_ON'),
(3, 8, 'Double Boneless Chicken Portion', 120.00, FALSE, 'PORTION_SIZE'),
(4, 8, 'Extra Spicy Salna Gravy', 25.00, FALSE, 'SPICE_LEVEL'),
(5, 8, 'Boiled Egg (1 Pc)', 20.00, FALSE, 'ADD_ON'),
(6, 11, 'Add Double Cheddar Cheese', 40.00, FALSE, 'EXTRA_CHEESE'),
(7, 11, 'Extra Crispy Bacon (Chicken)', 60.00, FALSE, 'TOPPING'),
(8, 11, 'Upgrade to Large Crinkle Fries & Coke', 79.00, FALSE, 'PORTION_SIZE'),
(9, 15, 'Extra Filter Sambar Cup', 25.00, FALSE, 'ADD_ON'),
(10, 18, 'Extra Mutton Gravy Bowl', 50.00, FALSE, 'ADD_ON')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 8. INVENTORY
INSERT INTO inventory (food_item_id, initial_stock, sold_quantity, current_stock, low_stock_threshold) VALUES
(1, 100, 20, 80, 15),
(2, 150, 30, 120, 20),
(3, 80, 15, 65, 10),
(4, 250, 50, 200, 30),
(5, 180, 30, 150, 25),
(6, 100, 10, 90, 15),
(7, 80, 10, 70, 10),
(8, 140, 30, 110, 15),
(9, 90, 15, 75, 12),
(10, 70, 10, 60, 10),
(11, 100, 15, 85, 12),
(12, 100, 10, 90, 15),
(13, 110, 10, 100, 15),
(14, 130, 10, 120, 20),
(15, 160, 20, 140, 20),
(16, 95, 10, 85, 15),
(17, 105, 10, 95, 15),
(18, 70, 10, 60, 10),
(19, 110, 15, 95, 15),
(20, 90, 10, 80, 15),
(21, 200, 20, 180, 25),
(22, 130, 10, 120, 15),
(23, 100, 10, 90, 15),
(24, 80, 10, 70, 10)
ON DUPLICATE KEY UPDATE current_stock=VALUES(current_stock);

-- 9. PAYMENT SETTINGS
INSERT INTO payment_settings (id, setting_key, setting_value, description, is_active) VALUES
(1, 'cod_enabled', 'true', 'Enable or disable Cash on Delivery globally', TRUE),
(2, 'upi_enabled', 'true', 'Enable or disable Direct UPI payment option', TRUE),
(3, 'upi_id', 'feastora@icici', 'Merchant UPI Virtual Payment Address', TRUE),
(4, 'upi_qr_url', 'https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=upi://pay?pa=feastora@icici&pn=FEASTORA&cu=INR', 'Active Dynamic QR Code Image URL', TRUE),
(5, 'razorpay_enabled', 'true', 'Enable Razorpay payment gateway integration', TRUE),
(6, 'razorpay_key_id', 'rzp_test_FeastoraOfficial2026', 'Public Razorpay Gateway Key ID', TRUE)
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- 10. COUPONS
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_value, max_discount_amount, valid_from, valid_until, is_active) VALUES
(1, 'FEAST50', 'Get 50% discount on your favorite cravings', 'PERCENTAGE', 50.00, 199.00, 100.00, '2026-01-01 00:00:00', '2027-12-31 23:59:59', TRUE),
(2, 'WELCOME100', 'Flat ₹100 discount on your first order above ₹299', 'FLAT', 100.00, 299.00, 100.00, '2026-01-01 00:00:00', '2027-12-31 23:59:59', TRUE),
(3, 'SUPERFEAST', 'Flat 20% off up to ₹150 for orders above ₹399', 'PERCENTAGE', 20.00, 399.00, 150.00, '2026-01-01 00:00:00', '2027-12-31 23:59:59', TRUE),
(4, 'BIRYANI25', 'Special 25% discount on all Royal Biryanis', 'PERCENTAGE', 25.00, 249.00, 120.00, '2026-01-01 00:00:00', '2027-12-31 23:59:59', TRUE)
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 11. DELIVERY PARTNERS
INSERT INTO delivery_partners (id, name, phone, vehicle_number, rating, is_active, is_available) VALUES
(1, 'Rajesh Kumar', '+91 9886012345', 'KA-01-EZ-4521', 4.9, TRUE, TRUE),
(2, 'Karthik Raman', '+91 9742098765', 'TN-09-BK-8812', 4.8, TRUE, TRUE),
(3, 'Sunil Gowda', '+91 9901234567', 'KA-05-MQ-1994', 4.7, TRUE, FALSE),
(4, 'Praveen Kumar', '+91 9844054321', 'KA-03-HL-7733', 4.8, TRUE, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 12. SAMPLE ORDERS
INSERT INTO orders (id, order_number, user_id, restaurant_id, delivery_address_id, delivery_partner_id, recipient_name, recipient_phone, delivery_address_text, total_item_amount, delivery_fee, tax_amount, discount_amount, coupon_code, grand_total, payment_method, payment_status, order_status, estimated_delivery_time, created_at) VALUES
(1, 'FST-20261118-001', 2, 1, 1, 1, 'Rahul Sharma', '+91 9845012345', '#42, 4th Cross, 100ft Road, Indiranagar, Bengaluru - 560038', 280.00, 35.00, 14.00, 50.00, 'FEAST50', 279.00, 'UPI', 'VERIFIED_BY_ADMIN', 'DELIVERED', '2026-11-18 13:30:00', '2026-11-18 12:45:00'),
(2, 'FST-20261118-002', 3, 5, 3, 2, 'Priya Patel', '+91 9741023456', 'Flat 302, Green Meadows, 2nd Main, T. Nagar, Chennai - 600017', 630.00, 45.00, 31.50, 100.00, 'WELCOME100', 606.50, 'UPI', 'SUCCESS', 'OUT_FOR DELIVERY', '2026-11-18 20:15:00', '2026-11-18 19:35:00'),
(3, 'FST-20261118-003', 4, 8, 4, 4, 'Anand Kumar', '+91 9900134567', 'Villa 14, Royal Palm Enclave, Nazarbad, Mysore - 570010', 450.00, 35.00, 22.50, 0.00, NULL, 507.50, 'COD', 'PENDING', 'FOOD_PREPARING', '2026-11-18 20:30:00', '2026-11-18 19:50:00')
ON DUPLICATE KEY UPDATE order_number=VALUES(order_number);

-- 13. ORDER ITEMS
INSERT INTO order_items (order_id, food_item_id, item_name, quantity, unit_price, subtotal, customizations_json) VALUES
(1, 1, 'MTR Special Rava Idli', 2, 75.00, 150.00, '[]'),
(1, 2, 'Pure Ghee Masala Dosa', 1, 110.00, 110.00, '[{"name":"Extra Desi Ghee Dollop","price":20.0}]'),
(1, 4, 'Degree Filter Coffee', 1, 20.00, 20.00, '[]'),
(2, 8, 'Meghana Special Chicken Biryani', 1, 340.00, 340.00, '[{"name":"Extra Spicy Salna Gravy","price":25.0}]'),
(2, 9, 'Andhra Chilli Chicken', 1, 290.00, 290.00, '[]'),
(3, 11, 'All American Cheese Burger', 1, 260.00, 260.00, '[{"name":"Add Double Cheddar Cheese","price":40.0}]'),
(3, 13, 'Ferrero Rocher Thick Shake', 1, 190.00, 190.00, '[]');

-- 14. ORDER STATUS HISTORY
INSERT INTO order_status_history (order_id, status, comment, updated_by_user_id) VALUES
(1, 'ORDER_PLACED', 'Order placed successfully by customer', 2),
(1, 'ORDER_CONFIRMED', 'Restaurant MTR accepted order', 1),
(1, 'FOOD_PREPARING', 'Chef is preparing Rava Idli and Ghee Dosa', 1),
(1, 'READY_FOR_PICKUP', 'Food packed neatly in eco-friendly boxes', 1),
(1, 'DELIVERY_PARTNER_ASSIGNED', 'Rajesh Kumar assigned to pickup order', 1),
(1, 'OUT_FOR DELIVERY', 'Delivery partner is 1.5 km away', 1),
(1, 'DELIVERED', 'Delivered safely at doorstep', 1),
(2, 'ORDER_PLACED', 'Order received for dinner rush', 3),
(2, 'ORDER_CONFIRMED', 'Meghana Foods kitchen accepted order', 1),
(2, 'FOOD_PREPARING', 'Simmering dum biryani and fresh chilli chicken', 1),
(2, 'DELIVERY_PARTNER_ASSIGNED', 'Karthik Raman assigned for delivery', 1),
(2, 'OUT_FOR DELIVERY', 'Partner on transit to customer residence', 1),
(3, 'ORDER_PLACED', 'Cash on Delivery order placed', 4),
(3, 'ORDER_CONFIRMED', 'Truffles kitchen confirmed order', 1),
(3, 'FOOD_PREPARING', 'Grilling fresh patty and making Ferrero shake', 1);

-- 15. PAYMENTS
INSERT INTO payments (order_id, payment_method, amount, transaction_id, upi_reference, payment_status, verified_by_admin_id, verified_at) VALUES
(1, 'UPI', 279.00, 'TXN_FEASTORA_998124', 'UPI-REF-2384918239', 'VERIFIED_BY_ADMIN', 1, '2026-11-18 12:48:00'),
(2, 'UPI', 606.50, 'TXN_FEASTORA_998125', 'UPI-REF-9921471029', 'SUCCESS', NULL, NULL),
(3, 'COD', 507.50, 'TXN_COD_998126', NULL, 'PENDING', NULL, NULL);

-- 16. REVIEWS
INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment) VALUES
(2, 1, 1, 5, 'The Rava Idli is unmatched anywhere in India! Golden ghee aroma was heavenly. Prompt delivery!'),
(3, 5, 2, 5, 'Nobody beats Meghana Biryani for spice and juicy chicken. The packaging was completely spill-proof.'),
(4, 3, NULL, 5, 'CTR crispy benne dosa brings back childhood memories. Feastora delivery was fast and hot!');
