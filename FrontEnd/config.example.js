// Copy to config.js and fill values from CDK outputs
window.CONFIG = {
region: "us-east-1",
apiBaseUrl: "https://api.yourdomain.com", // custom domain for API Gateway
cognito: {
userPoolId: "us-east-1_XXXXXXX",
userPoolClientId: "YYYYYYYYYYYY",
domain: "your-prefix.auth.us-east-1.amazoncognito.com",
redirectUri: "https://app.yourdomain.com/" // or your GitHub Pages URL
}
};
