export async function GET() {
  // Socket.IO is initialized in the custom server (server.js)
  // This endpoint just confirms the server is running

  return new Response(JSON.stringify({
    message: 'Socket.IO server is running',
    status: 'ok'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}