-- Reposition existing profile cards using Fermat spiral algorithm
-- Ordered by created_at so earliest profiles are at center

WITH spiral_positions AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS n
  FROM user_profiles
  WHERE name IS NOT NULL
),
calculated AS (
  SELECT 
    id,
    n,
    -- Spiral parameters
    -- Golden angle: 137.507764 degrees = 2.399963 radians
    -- Spacing factor: 110
    -- Fixed center for 80 cards: (1234, 1284)
    CASE 
      WHEN n = 0 THEN 1234
      ELSE 1234 + (110 * SQRT(n) * COS(n * 2.399963))
    END AS card_center_x,
    CASE 
      WHEN n = 0 THEN 1284
      ELSE 1284 + (110 * SQRT(n) * SIN(n * 2.399963))
    END AS card_center_y
  FROM spiral_positions
)
UPDATE user_profiles up
SET 
  wall_position_x = ROUND(c.card_center_x - 100),  -- Convert center to top-left (half card width)
  wall_position_y = ROUND(c.card_center_y - 125)   -- Convert center to top-left (half card height)
FROM calculated c
WHERE up.id = c.id;