INSERT INTO users (user_id, created_at, email, nickname, provider, provider_id)
VALUES (
  990098,
  CURRENT_TIMESTAMP,
  'authenticated-e2e@example.com',
  'Authenticated E2E User',
  'e2e',
  'authenticated-e2e-user'
)
ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  nickname = VALUES(nickname);
