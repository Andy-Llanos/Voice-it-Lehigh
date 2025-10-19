# Voice-it-Lehigh
Anonymous feedback for courses(professors and Ta's) , athletics, clubs , fraternities and sororities and all other organizations on campus
random test
---
YOUTUBE DEMO LINK: https://youtu.be/NVHi1HuBrxA

## Root README.md
```md
# Realtime Feedback — Skeleton
- Frontend: static site (GitHub Pages or S3+CloudFront)
- Backend: API Gateway HTTP API + Lambda + DynamoDB
- Auth: Cognito Hosted UI (PKCE)
- Custom Domain: `api.yourdomain.com` (backend) and optional `app.yourdomain.com` (frontend)


## Steps
1. **Deploy infra** (`infra/`): creates API, Cognito, DynamoDB, custom domain + DNS.
2. **Configure frontend**: copy `frontend/config.example.js` → `frontend/config.js` and set values from CDK outputs.
3. **Run locally**: `cd frontend && python3 -m http.server` → open http://localhost:8000
4. **Deploy frontend**:
- **GitHub Pages**: push `frontend/` to a repo, enable Pages, set custom domain `app.yourdomain.com`, add DNS CNAME to `<user>.github.io`.
- **(Optional) S3+CloudFront**: can be added later for full AWS hosting.


## Stretch (Realtime websockets)
- Add API Gateway WebSocket API + Lambdas to broadcast to room connections, or switch to AppSync GraphQL subscriptions.
