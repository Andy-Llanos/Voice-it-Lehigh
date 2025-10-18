const C = window.CONFIG;
const LS = {
idTokenKey: "id_token",
accessTokenKey: "access_token",
codeVerifierKey: "pkce_code_verifier"
};


function b64url(buf){return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function sha256(str){return await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))}
function randStr(n=32){return [...crypto.getRandomValues(new Uint8Array(n))].map(b=>('0'+b.toString(16)).slice(-2)).join('')}


async function signIn(){
const redirectUri = C.cognito.redirectUri;
const state = crypto.randomUUID();
const codeVerifier = randStr(); localStorage.setItem(LS.codeVerifierKey, codeVerifier);
const codeChallenge = b64url(await sha256(codeVerifier));
const url = `${C.cognito.domain}/oauth2/authorize?response_type=code&client_id=${C.cognito.userPoolClientId}`+
`&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid+email+profile`+
`&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;
window.location = url;
}


async function handleRedirect(){
if(!location.search.includes('code=')) return;
const params = new URLSearchParams(location.search);
const code = params.get('code');
const codeVerifier = localStorage.getItem(LS.codeVerifierKey);
const body = new URLSearchParams({
grant_type: 'authorization_code',
client_id: C.cognito.userPoolClientId,
code,
redirect_uri: C.cognito.redirectUri,
code_verifier: codeVerifier
});
const tok = await fetch(`${C.cognito.domain}/oauth2/token`, {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body}).then(r=>r.json());
if(tok.id_token){
localStorage.setItem(LS.idTokenKey, tok.id_token);
localStorage.setItem(LS.accessTokenKey, tok.access_token||'');
history.replaceState({}, '', C.cognito.redirectUri);
renderAuth();
}
}


function signOut(){
localStorage.removeItem(LS.idTokenKey); localStorage.removeItem(LS.accessTokenKey);
location.href = `${C.cognito.domain}/logout?client_id=${C.cognito.userPoolClientId}&logout_uri=${encodeURIComponent(C.cognito.redirectUri)}`;
}


function idToken(){ return localStorage.getItem(LS.idTokenKey); }
renderAuth();