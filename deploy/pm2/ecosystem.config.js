module.exports = {
  apps: [
    {
      name: 'imgtools-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run start:prod',
      env: {
        NODE_ENV: 'production',
        PORT: 3030,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
    },
  ],
}
