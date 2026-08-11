INSERT INTO source (source_id, source_api_id, source_name)
VALUES (990096, 'e2e-source', 'E2E Press')
ON DUPLICATE KEY UPDATE source_name = VALUES(source_name);

INSERT INTO users (user_id, created_at, email, nickname, provider, provider_id)
VALUES (
  990098,
  '2026-08-12 00:00:00',
  'authenticated-e2e@example.com',
  'Authenticated E2E User',
  'e2e',
  'authenticated-e2e-user'
)
ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  nickname = VALUES(nickname);

INSERT INTO article (
  article_id, author, category, content, country, crawled_content,
  description, published_at, summary, title, url, url_to_image,
  view_count, source_id, language
) VALUES (
  990096,
  'E2E Author',
  'technology',
  'E2E article content.',
  'KR',
  'This article verifies real frontend and backend integration automation.',
  'Article description for the full-stack E2E smoke test.',
  '2026-08-11 12:00:00',
  'This summary passed through the real backend and database.',
  'Full-stack E2E verification article',
  'https://example.com/e2e/full-stack-96',
  '',
  0,
  990096,
  'ko'
)
ON DUPLICATE KEY UPDATE
  crawled_content = VALUES(crawled_content),
  summary = VALUES(summary),
  title = VALUES(title);

INSERT INTO article (
  article_id, author, category, content, country, crawled_content,
  description, published_at, summary, title, url, url_to_image,
  view_count, source_id, language
) VALUES (
  990097,
  'E2E Author',
  'technology',
  'Second E2E article content.',
  'US',
  'This second article verifies client-side detail navigation.',
  'Second article description for the full-stack E2E smoke test.',
  '2026-08-11 11:00:00',
  'The second article summary passed through the real backend.',
  'Second full-stack E2E article',
  'https://example.com/e2e/full-stack-97',
  '',
  0,
  990096,
  'en'
)
ON DUPLICATE KEY UPDATE
  crawled_content = VALUES(crawled_content),
  summary = VALUES(summary),
  title = VALUES(title);
