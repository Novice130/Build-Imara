export async function onRequest(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return new Response('GITHUB_CLIENT_ID is not configured in Cloudflare Pages environment variables.', { status: 500 });
  }

  const scope = "repo,user";
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("scope", scope);
  
  return Response.redirect(authUrl.toString(), 302);
}
