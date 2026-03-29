# Deployment (Ubuntu 22.04)

## VM + ngrok (quick public URL)

Use this when you want to publish the app from a VM without buying/configuring a domain first.

1) Install runtime tools on VM:

```bash
sudo apt update
sudo apt install -y curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

2) Install ngrok and login once:

```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
	| sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
	| sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update
sudo apt install -y ngrok
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

3) Build and start the app with PM2:

```bash
cd /path/to/img-tool/frontend
npm ci
npm run build
cd ..
pm2 start deploy/pm2/ecosystem.config.js
pm2 save
pm2 startup
```

4) Expose app port 3030 using ngrok:

```bash
ngrok http 3030
```

ngrok will print a public URL like:

```text
https://xxxx-xx-xx-xx-xx.ngrok-free.app
```

5) Set public site URL for correct metadata/canonicals:

Create or update `frontend/.env` (or `frontend/.env.local`):

```env
NEXT_PUBLIC_SITE_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Then restart PM2:

```bash
pm2 restart imgtools-frontend --update-env
```

Notes:
- GA is optional. If `NEXT_PUBLIC_GA_ID` is missing, app will still run.
- Free ngrok URLs can change after restart. Update `NEXT_PUBLIC_SITE_URL` when URL changes.

## Keep ngrok running after reboot (optional)

```bash
sudo tee /etc/systemd/system/ngrok-imgtools.service >/dev/null <<'EOF'
[Unit]
Description=ngrok tunnel for imgtools frontend
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/bin/ngrok http 3030 --log=stdout
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now ngrok-imgtools
sudo systemctl status ngrok-imgtools --no-pager
```

Replace `User=ubuntu` with your VM username.

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
sudo certbot --nginx -d image-tools.tech -d www.image-tools.tech
```
