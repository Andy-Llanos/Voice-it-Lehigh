# Frontend
A static site that talks to the AWS backend.


1. Copy `config.example.js` to `config.js`, fill values from CDK outputs.
2. Serve locally: `python3 -m http.server` → http://localhost:8000
3. Deploy to GitHub Pages or S3+CloudFront.


### GitHub Pages + Custom Domain
- Add a DNS CNAME: `app.yourdomain.com` → `<your-username>.github.io`.
- In repo Settings → Pages → set custom domain to `app.yourdomain.com`.
- Add a `CNAME` file at repo root containing `app.yourdomain.com`.