const http = require("http");

const port = Number(process.env.GEMINI_MOCK_PORT ?? 19099);

http.createServer((request, response) => {
  request.resume();

  if (request.method === "GET" && request.url.startsWith("/publisher/")) {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`<!doctype html>
      <html lang="en">
        <head><title>Mock publisher article</title></head>
        <body>
          <main>
            <h1>Mock publisher article</h1>
            <p>This deterministic article body is served by the local E2E publisher.</p>
            <p>It verifies Backend crawling, Gemini summary, and browser popup navigation.</p>
          </main>
        </body>
      </html>`);
    return;
  }

  if (request.url.includes(":streamGenerateContent")) {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    response.write(`data: ${JSON.stringify({
      candidates: [{
        content: { parts: [{ text: "Backend SSE integration verified" }] },
      }],
    })}\n\n`);
    response.end();
    return;
  }

  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({
    candidates: [{ content: { parts: [{ text: "Mock summary" }] } }],
  }));
}).listen(port, "127.0.0.1", () => {
  console.log(`Gemini mock listening on ${port}`);
});
