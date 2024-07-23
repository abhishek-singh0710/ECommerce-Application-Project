export default {

    oidc: {
        clientId: '0oaie68zvnwS8dCKy5d7',
        issuer: 'https://dev-35927269.okta.com/oauth2/default',
        // redirectUri: 'http://localhost:4200/login/callback',  Changing From http To https
        redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    }

}
