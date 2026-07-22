$sql = "INSERT INTO trips (title, location, duration, price, old_price, image_url, subtitle, intro, is_popular, slug, status) VALUES ('Demo Paris Trip', 'Paris, France', '5 Days, 4 Nights', '49999', '59999', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', 'Experience the magic of Paris', 'This is a demo trip created to test the local frontend display.', true, 'demo-paris-trip-1234', 'active');"

$sql | ssh root@200.141.0.251 "mysql -u sht_user -p'SafeHands1431@' safehands_vps_db"
