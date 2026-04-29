const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const contentDir = path.join(__dirname, '..', 'content', 'blog');
const outputDir = path.join(__dirname, '..', 'blog');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ensure content directory exists
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

const siteUrl = 'https://buildimara.com';

function generatePostHTML(post, htmlContent) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.thumbnail ? `${siteUrl}${post.thumbnail}` : `${siteUrl}/assets/logo.png`,
    "datePublished": post.date,
    "description": post.description,
    "author": {
      "@type": "Organization",
      "name": "Build Imara"
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | Build Imara Blog</title>
  <meta name="description" content="${post.description}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.description}">
  ${post.thumbnail ? `<meta property="og:image" content="${siteUrl}${post.thumbnail}">` : ''}
  <meta property="og:type" content="article">
  <link rel="icon" type="image/png" href="../assets/favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&family=Work+Sans:wght@400..700&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
  <script id="tailwind-config">
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: "#003a53",
              "primary-container": "#005274",
              surface: "#fcf9f2",
            },
            fontFamily: {
              headline: ["Manrope"],
              body: ["Work Sans"],
            }
          }
        }
      }
  </script>
  <script type="application/ld+json">
    ${JSON.stringify(jsonLd)}
  </script>
</head>
<body class="bg-surface font-body text-gray-800">
  <nav class="w-full bg-white shadow-sm px-8 py-6 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2">
      <img src="../assets/logo.png" alt="Build Imara Logo" class="h-8 w-auto">
      <div class="text-2xl font-headline font-extrabold text-primary">Build Imara</div>
    </a>
    <a href="/blog" class="font-headline font-bold text-sm uppercase text-gray-600 hover:text-primary">Back to Blog</a>
  </nav>

  <main class="max-w-screen-md mx-auto px-8 py-16">
    <article class="prose prose-lg prose-headings:font-headline prose-a:text-primary hover:prose-a:text-primary-container max-w-none">
      ${post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.altText || post.title}" class="w-full h-64 object-cover rounded-xl mb-8 shadow-sm">` : ''}
      <h1 class="text-4xl font-headline font-extrabold text-primary mb-4">${post.title}</h1>
      <p class="text-gray-500 text-sm mb-8">${new Date(post.date).toLocaleDateString()}</p>
      ${htmlContent}
    </article>
  </main>
  
  <footer class="text-center py-8 text-sm text-gray-500 border-t border-gray-200 mt-12">
    &copy; ${new Date().getFullYear()} Build Imara. Quality Homes. Affordable Prices. Your Trust.
  </footer>
</body>
</html>`;
}

function generateBlogIndex(posts) {
  const postsHTML = posts.map(post => `
    <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
      ${post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.altText || post.title}" class="w-full h-48 object-cover">` : ''}
      <div class="p-6 flex-grow flex flex-col">
        <h2 class="text-2xl font-headline font-bold text-primary mb-2">${post.title}</h2>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">${post.description}</p>
        <div class="mt-auto flex justify-between items-center">
            <span class="text-xs text-gray-400 font-semibold uppercase tracking-wider">${new Date(post.date).toLocaleDateString()}</span>
            <a href="/blog/${post.slug}.html" class="text-primary font-bold text-sm uppercase tracking-widest hover:text-primary-container inline-block">Read More &rarr;</a>
        </div>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog | Build Imara</title>
  <meta name="description" content="Read the latest insights and guides on home construction from Build Imara.">
  <link rel="icon" type="image/png" href="../assets/favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&family=Work+Sans:wght@400..700&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <script id="tailwind-config">
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: "#003a53",
              "primary-container": "#005274",
              surface: "#fcf9f2",
            },
            fontFamily: {
              headline: ["Manrope"],
              body: ["Work Sans"],
            }
          }
        }
      }
  </script>
</head>
<body class="bg-surface font-body text-gray-800">
  <nav class="w-full bg-white shadow-sm px-8 py-6 flex items-center justify-between max-w-screen-2xl mx-auto">
    <a href="/" class="flex items-center gap-2">
      <img src="../assets/logo.png" alt="Build Imara Logo" class="h-8 w-auto">
      <div class="text-2xl font-headline font-extrabold text-primary">Build Imara</div>
    </a>
    <a href="/" class="font-headline font-bold text-sm uppercase text-gray-600 hover:text-primary">Back to Home</a>
  </nav>

  <main class="max-w-screen-xl mx-auto px-8 py-16">
    <div class="text-center mb-16">
      <h1 class="text-5xl font-headline font-extrabold text-primary mb-4">Our Blog</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">Latest updates, construction tips, and insights from the experts at Build Imara.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      ${postsHTML}
    </div>
  </main>
</body>
</html>`;
}

function generateSitemap(posts) {
  const urls = posts.map(post => `
  <url>
    <loc>${siteUrl}/blog/${post.slug}.html</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>${urls}
</urlset>`;
}

async function build() {
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);
    
    const htmlContent = marked.parse(parsed.content);
    const slug = path.basename(file, '.md');
    
    const post = {
      slug,
      title: parsed.data.title,
      date: parsed.data.date,
      description: parsed.data.description,
      thumbnail: parsed.data.thumbnail,
      altText: parsed.data.altText,
    };
    
    posts.push(post);
    
    const html = generatePostHTML(post, htmlContent);
    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
  }

  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Generate Blog Index
  fs.writeFileSync(path.join(outputDir, 'index.html'), generateBlogIndex(posts));

  // Generate Sitemap
  fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), generateSitemap(posts));

  console.log(`Successfully built ${posts.length} blog posts.`);
}

build().catch(console.error);
