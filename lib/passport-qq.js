var _ = require('underscore'),
    util = require('util'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    InternalOAuthError = require('passport-oauth').InternalOAuthError;

function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://graph.qq.com/oauth2.0/authorize';
    options.tokenURL = options.tokenURL || 'https://graph.qq.com/oauth2.0/token';
    options.scopeSeparator = options.scopeSeparator || ',';
    
    OAuth2Strategy.call(this, options, verify);
    this.name = 'qq';
    this._profileURL = options.profileURL || 'https://graph.qq.com/oauth2.0/me';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
    var oauth2 = this._oauth2,
        userInfoUrl = 'https://graph.qq.com/user/get_user_info',
        openid;

    oauth2.getProtectedResource(this._profileURL, accessToken, function (err, result, res) {
        if (err) {
            return done(new InternalOAuthError('failed to fetch user profile', err));
        }

        try {
            openid = JSON.parse(result.match(/\{.*\}/)[0]).openid;
            userInfoUrl +=  '?openid=' + openid;
        } catch (e) {
            return done(e);
        }

        oauth2.get(userInfoUrl, accessToken, function (err, body, res) {
            try {
                var json = JSON.parse(body);

                var profile = { provider: 'qq' };
                profile.id = openid;
                profile.nickname = json.nickname;
                profile.gender = json.gender;
                profile._raw = body;
                profile._json = json;
                done(null, profile);
            } catch(e) {
                done(e);
            }
        });
    });
}

module.exports = Strategy;
