# Build Imara

Build Imara is a static marketing website for a home construction business in Hyderabad. The project is built with plain HTML, CSS, and JavaScript, and is prepared for containerized deployment with Docker, Nginx, and Dokploy.

## Overview

This repository contains:
- A landing page in `index.html`
- Shared styles in `css/style.css`
- Component styles in `css/components.css`
- Homepage-specific styles in `css/homepage.css`
- Frontend interactions in `js/main.js`
- EMI and cost calculator logic in `js/calculator.js`
- Static assets in `assets/`
- Docker deployment files for local and Dokploy hosting

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Nginx
- Docker
- Docker Compose
- Dokploy

## Project Structure

```text
Build_Imara/
├── assets/
│   ├── favicon.svg
│   └── logo.png
├── css/
│   ├── components.css
│   ├── homepage.css
│   └── style.css
├── js/
│   ├── calculator.js
│   └── main.js
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── index.html
├── nginx.conf
└── README.md
```

## Features

- Responsive landing page
- Service and pricing sections
- Testimonials and FAQ accordion
- Project filtering UI
- Animated counters and reveal-on-scroll effects
- EMI calculator logic
- Cost estimator logic
- WhatsApp CTA integration
- Docker-ready deployment

## Local Development

Since this is a static site, you can open `index.html` directly in a browser.

For a better local experience, serve it with a simple static server.

## Run with Docker

### Build image

```bash
docker build -t build-imara .
```

### Run container

```bash
docker run -p 80:80 build-imara
```

Then open:
- `http://localhost`

## Run with Docker Compose

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

## Nginx Setup

The container uses Nginx to serve the static files.

Key behavior from `nginx.conf`:
- Serves files from `/usr/share/nginx/html`
- Uses `index.html` as the entry file
- Falls back to `index.html` for unmatched routes
- Adds cache headers for static assets

## Dokploy Deployment

This project is ready for Dokploy.

### Option 1: Dockerfile deployment
1. Connect this GitHub repository in Dokploy.
2. Create a new application.
3. Choose Dockerfile deployment.
4. Use the root `Dockerfile`.
5. Set the container port to `80`.
6. Configure the domain.
7. Deploy.

### Option 2: Docker Compose deployment
1. Connect this GitHub repository in Dokploy.
2. Create a new application.
3. Choose Docker Compose deployment.
4. Use `docker-compose.yml`.
5. Expose port `80`.
6. Configure the domain.
7. Deploy.

## Important Notes

- The site currently uses placeholder phone numbers in JavaScript and HTML.
- Some links in `index.html` point to additional pages under `pages/` that are not included in this repository yet.
- Docker must be running locally if you want to build or test the image on your machine.

## Files for Deployment

- `Dockerfile` — builds the production image
- `nginx.conf` — Nginx server configuration
- `docker-compose.yml` — compose deployment definition
- `.dockerignore` — excludes unnecessary files from the Docker build context

## Future Improvements

- Replace placeholder phone numbers and contact details
- Add the missing inner pages under `pages/`
- Add analytics and SEO enhancements
- Add a proper contact form backend or form service integration
- Add CI/CD checks for Docker build validation

## License

This project is private/proprietary unless the repository owner specifies otherwise.
