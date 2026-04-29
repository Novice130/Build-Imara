export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const provider = 'github';

  if (!code) {
    return new Response('No code provided in the URL.', { status: 400 });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing from Cloudflare Pages environment variables.', { status: 500 });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const data = await response.json();
    const token = data.access_token;

    if (!token) {
      throw new Error(data.error_description || 'Failed to get token from GitHub');
    }

    // Decap CMS expects this exact postMessage structure to securely receive the token
    const script = `
      <script>
        const message = "authorization:${provider}:success:{\\"token\\":\\"${token}\\",\\"provider\\":\\"${provider}\\"}";
        window.opener.postMessage(message, new URL(window.location.origin).origin);
        window.close();
      </script>
    `;

    return new Response(script, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  } catch (error) {
    const script = `
      <script>
        const message = "authorization:${provider}:error:{\\"message\\":\\"${error.message}\\"}";
        window.opener.postMessage(message, new URL(window.location.origin).origin);
        window.close();
      </script>
    `;
    return new Response(script, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }
}
