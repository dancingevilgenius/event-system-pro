-- Dummy shirt inventory for merchandise POS demo (after fictional events in 011).
--   psql -U postgres -d event_system_pro -f database/seeds/016_merchandise_pos_demo.sql

\connect event_system_pro

INSERT INTO public.merchandise_sales (event_code, merchandise_json, created_by)
SELECT
  e.event_code,
  json_build_object(
    'items',
    json_build_array(
      json_build_object('sku', 'M-TEE-CLASSIC-NVY-S', 'gender', 'Men', 'size', 'S', 'color', 'Navy', 'description', 'Men''s Swing State Classic cotton crew neck tee, navy, small', 'unit_price', 26.00),
      json_build_object('sku', 'M-TEE-CLASSIC-NVY-M', 'gender', 'Men', 'size', 'M', 'color', 'Navy', 'description', 'Men''s Swing State Classic cotton crew neck tee, navy, medium', 'unit_price', 26.00),
      json_build_object('sku', 'M-TEE-CLASSIC-NVY-L', 'gender', 'Men', 'size', 'L', 'color', 'Navy', 'description', 'Men''s Swing State Classic cotton crew neck tee, navy, large', 'unit_price', 26.00),
      json_build_object('sku', 'M-TEE-CLASSIC-NVY-XL', 'gender', 'Men', 'size', 'XL', 'color', 'Navy', 'description', 'Men''s Swing State Classic cotton crew neck tee, navy, extra large', 'unit_price', 28.00),
      json_build_object('sku', 'M-TEE-CLASSIC-WHT-M', 'gender', 'Men', 'size', 'M', 'color', 'White', 'description', 'Men''s Swing State Classic cotton crew neck tee, white, medium', 'unit_price', 26.00),
      json_build_object('sku', 'M-TEE-CLASSIC-WHT-L', 'gender', 'Men', 'size', 'L', 'color', 'White', 'description', 'Men''s Swing State Classic cotton crew neck tee, white, large', 'unit_price', 26.00),
      json_build_object('sku', 'M-TEE-CLASSIC-HGR-M', 'gender', 'Men', 'size', 'M', 'color', 'Heather Gray', 'description', 'Men''s Swing State Classic cotton crew neck tee, heather gray, medium', 'unit_price', 26.00),
      json_build_object('sku', 'M-TEE-CLASSIC-BLK-L', 'gender', 'Men', 'size', 'L', 'color', 'Black', 'description', 'Men''s Swing State Classic cotton crew neck tee, black, large', 'unit_price', 26.00),
      json_build_object('sku', 'M-TEE-VNK-NVY-M', 'gender', 'Men', 'size', 'M', 'color', 'Navy', 'description', 'Men''s Swing State Classic v-neck tee, navy, medium', 'unit_price', 28.00),
      json_build_object('sku', 'M-TEE-VNK-BLK-L', 'gender', 'Men', 'size', 'L', 'color', 'Black', 'description', 'Men''s Swing State Classic v-neck tee, black, large', 'unit_price', 28.00),
      json_build_object('sku', 'M-TEE-LS-NVY-M', 'gender', 'Men', 'size', 'M', 'color', 'Navy', 'description', 'Men''s Swing State Classic long sleeve tee, navy, medium', 'unit_price', 32.00),
      json_build_object('sku', 'M-TEE-LS-NVY-L', 'gender', 'Men', 'size', 'L', 'color', 'Navy', 'description', 'Men''s Swing State Classic long sleeve tee, navy, large', 'unit_price', 32.00),
      json_build_object('sku', 'M-POLO-NVY-M', 'gender', 'Men', 'size', 'M', 'color', 'Navy', 'description', 'Men''s Swing State Classic event polo shirt, navy, medium', 'unit_price', 38.00),
      json_build_object('sku', 'M-POLO-WHT-L', 'gender', 'Men', 'size', 'L', 'color', 'White', 'description', 'Men''s Swing State Classic event polo shirt, white, large', 'unit_price', 38.00),
      json_build_object('sku', 'W-TEE-CLASSIC-NVY-S', 'gender', 'Women', 'size', 'S', 'color', 'Navy', 'description', 'Women''s Swing State Classic fitted cotton tee, navy, small', 'unit_price', 26.00),
      json_build_object('sku', 'W-TEE-CLASSIC-NVY-M', 'gender', 'Women', 'size', 'M', 'color', 'Navy', 'description', 'Women''s Swing State Classic fitted cotton tee, navy, medium', 'unit_price', 26.00),
      json_build_object('sku', 'W-TEE-CLASSIC-NVY-L', 'gender', 'Women', 'size', 'L', 'color', 'Navy', 'description', 'Women''s Swing State Classic fitted cotton tee, navy, large', 'unit_price', 26.00),
      json_build_object('sku', 'W-TEE-CLASSIC-ROS-M', 'gender', 'Women', 'size', 'M', 'color', 'Rose', 'description', 'Women''s Swing State Classic fitted cotton tee, rose, medium', 'unit_price', 26.00),
      json_build_object('sku', 'W-TEE-CLASSIC-ROS-L', 'gender', 'Women', 'size', 'L', 'color', 'Rose', 'description', 'Women''s Swing State Classic fitted cotton tee, rose, large', 'unit_price', 26.00),
      json_build_object('sku', 'W-TEE-CLASSIC-WHT-M', 'gender', 'Women', 'size', 'M', 'color', 'White', 'description', 'Women''s Swing State Classic fitted cotton tee, white, medium', 'unit_price', 26.00),
      json_build_object('sku', 'W-TEE-CLASSIC-HGR-S', 'gender', 'Women', 'size', 'S', 'color', 'Heather Gray', 'description', 'Women''s Swing State Classic fitted cotton tee, heather gray, small', 'unit_price', 26.00),
      json_build_object('sku', 'W-TEE-VNK-NVY-M', 'gender', 'Women', 'size', 'M', 'color', 'Navy', 'description', 'Women''s Swing State Classic v-neck tee, navy, medium', 'unit_price', 28.00),
      json_build_object('sku', 'W-TEE-VNK-HGR-M', 'gender', 'Women', 'size', 'M', 'color', 'Heather Gray', 'description', 'Women''s Swing State Classic v-neck tee, heather gray, medium', 'unit_price', 28.00),
      json_build_object('sku', 'W-TEE-LS-CRD-M', 'gender', 'Women', 'size', 'M', 'color', 'Cardinal Red', 'description', 'Women''s Swing State Classic long sleeve tee, cardinal red, medium', 'unit_price', 32.00),
      json_build_object('sku', 'W-TEE-LS-CRD-L', 'gender', 'Women', 'size', 'L', 'color', 'Cardinal Red', 'description', 'Women''s Swing State Classic long sleeve tee, cardinal red, large', 'unit_price', 32.00),
      json_build_object('sku', 'W-POLO-NVY-M', 'gender', 'Women', 'size', 'M', 'color', 'Navy', 'description', 'Women''s Swing State Classic event polo shirt, navy, medium', 'unit_price', 38.00),
      json_build_object('sku', 'W-POLO-WHT-S', 'gender', 'Women', 'size', 'S', 'color', 'White', 'description', 'Women''s Swing State Classic event polo shirt, white, small', 'unit_price', 38.00)
    )
  ),
  'c-agent'
FROM public."event" AS e
WHERE e.event_code = 'SWING_STATE_CLASSIC_2025_JUN'
ON CONFLICT (event_code) DO UPDATE
SET merchandise_json = EXCLUDED.merchandise_json;

NOTIFY pgrst, 'reload schema';
