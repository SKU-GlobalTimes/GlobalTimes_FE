INSERT INTO source (source_id, source_api_id, source_name)
VALUES (990096, 'e2e-source', 'E2E Press')
ON DUPLICATE KEY UPDATE source_name = VALUES(source_name);

INSERT INTO source (source_id, source_api_id, source_name)
VALUES
  (990102, 'e2e-perspectives-kr', 'Lunaris Korea'),
  (990103, 'e2e-perspectives-us', 'Lunaris US'),
  (990104, 'e2e-perspectives-jp', 'Lunaris Japan')
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
) VALUES
  (
    990102,
    'E2E Korea Author',
    'politics',
    '루나리스 정상회담 공동성명 기사 본문입니다.',
    'KR',
    '루나리스 정상회담에서 공동성명을 발표한 배경과 주요 합의를 설명합니다.',
    '루나리스 정상회담 공동성명과 국가별 반응을 다룹니다.',
    '2026-08-11 10:00:00',
    '루나리스 정상회담 공동성명 요약입니다.',
    '루나리스 정상회담 공동성명 발표',
    'https://example.com/e2e/lunaris-kr',
    '',
    0,
    990102,
    'ko'
  ),
  (
    990103,
    'E2E US Author',
    'politics',
    'US coverage of the Lunaris summit joint statement.',
    'US',
    'US officials respond to the Lunaris summit joint statement and its agreements.',
    'Lunaris summit joint statement draws a response from US officials.',
    '2026-08-11 09:00:00',
    'US response to the Lunaris summit joint statement.',
    'Lunaris summit joint statement draws US response',
    'https://example.com/e2e/lunaris-us',
    '',
    0,
    990103,
    'en'
  ),
  (
    990104,
    'E2E Japan Author',
    'politics',
    'Japan coverage of the Lunaris summit joint statement.',
    'JP',
    'Japan reviews the Lunaris summit joint statement and regional implications.',
    'Japan reviews the Lunaris summit joint statement and regional implications.',
    '2026-08-11 08:00:00',
    'Japan response to the Lunaris summit joint statement.',
    'Japan reviews Lunaris summit joint statement',
    'https://example.com/e2e/lunaris-jp',
    '',
    0,
    990104,
    'en'
  )
ON DUPLICATE KEY UPDATE
  country = VALUES(country),
  description = VALUES(description),
  crawled_content = VALUES(crawled_content),
  summary = VALUES(summary),
  title = VALUES(title),
  language = VALUES(language);

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
