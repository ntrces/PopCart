-- Create or replace the order_summary_view in the popcart database
-- Run this file against the `popcart` database (see commands below)

USE popcart;

CREATE OR REPLACE VIEW order_summary_view AS
SELECT
    -- 1. User Information
    u.lastname,
    u.firstname,
    u.email,
    u.contact_number,

    -- 2. Shipping Address Information (filtered for 'default' status)
    sa.address_label,
    sa.postal_code,
    sa.street_address,
    sa.city_municipality,
    sa.province,

    -- 3. Order Header Information
    oh.order_number,
    oh.order_date,
    oh.order_time,
    oh.order_status,

    -- 4. Product and Quantity Information
    od.item_qty,
    p.album_title,
    p.artist,
    p.price,
    p.stock,
    p.genre,
    p.released_year,
    p.album_cover_img,
    p.description
FROM
    order_header oh
LEFT JOIN
    users u ON oh.user_id = u.user_id
LEFT JOIN
    shipping_address sa ON u.shipping_id = sa.shipping_address_id AND sa.status = 'default'
LEFT JOIN
    order_details od ON oh.order_header_id = od.order_header_id
LEFT JOIN
    products p ON od.product_id = p.product_id;

-- Notes:
-- 1) If you run this and get a "definer" or permissions error, run it as a user with CREATE VIEW privilege (e.g., root).
-- 2) To preview data use: SELECT * FROM order_summary_view LIMIT 100;

-- To apply via command line (Windows):
-- Open a terminal and run:
-- mysql -u root -p popcart < "c:/xampp/htdocs/PopCart1/PopCart/PopCart/sql/order_summary_view.sql"

-- Or import the file via phpMyAdmin: choose the `popcart` database, use Import, and upload this SQL file.
