# Deployment (Ubuntu 22.04)

## PM2

From the repo root:

```bash
cd frontend
npm ci
npm run build
cd ..
pm2 start deploy/pm2/ecosystem.config.js
pm2 save
```

## Nginx + HTTPS

1) Copy config:

```bash
sudo mkdir -p /var/www/certbot
sudo cp deploy/nginx/imgtools.conf /etc/nginx/sites-available/imgtools.conf
sudo ln -sf /etc/nginx/sites-available/imgtools.conf /etc/nginx/sites-enabled/imgtools.conf
sudo nginx -t
sudo systemctl reload nginx
```

2) Run Certbot:

```bash
sudo certbot --nginx -d yourdomain.tech -d www.yourdomain.tech
```
