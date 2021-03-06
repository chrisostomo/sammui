'use strict';

angular.module('sammui.apiAuthServices', ['ngResource', 'ngRoute', 'ngCookies'])

    .factory('oAuthHttpInjector', ['oAuthSession', function (oAuthSession) {
        var sessionInjector = {
            request: function (config) {
                if (oAuthSession.access_token) {
                    config.params = {
                        access_token: oAuthSession.access_token
                    };
                }
                return config;
            }
        };
        return sessionInjector;
    }])

    .service('oAuthSession', ['$rootScope', function ($rootScope) {

        this.create = function (userInfo) {
            this.access_token = userInfo.access_token;
            this.authenticated = userInfo.authenticated;
            this.authenticated_fully = userInfo.authenticated_fully;
            this.authenticated_anonymously = userInfo.authenticated_anonymously;
            this.role_user = userInfo.role_user;
            this.role_admin = userInfo.role_admin;
            this.role_anonymous = userInfo.role_anonymous;
            this.client = userInfo.client || null;
            this.username = (userInfo.user) ? userInfo.user.username : null;
            this.email = (userInfo.user) ? userInfo.user.email : null;
            this.roles = (userInfo.user) ? userInfo.user.roles : null;

            $rootScope.$broadcast('event:auth-sessionCreated');
        };

        this.destroy = function () {
            this.access_token = null;
            this.authenticated = null;
            this.authenticated_fully = null;
            this.authenticated_anonymously = null;
            this.role_user = null;
            this.role_admin = null;
            this.role_anonymous = null;
            this.client = null;
            this.username = null;
            this.email = null;
            this.roles = null;

            $rootScope.$broadcast('event:auth-sessionDestroyed');
        };

        return this;
    }])
    // Resource factories for OAuth API
    .factory('oAuth', ['$http', '$rootScope', '$cookieStore', 'authService', 'oAuthSession', function ($http, $rootScope,  $cookieStore, authService, oAuthSession) {

        // Sammui client ID and Secret, you should get one with the client:create command at symfony
        // To-do: Where should I store credentials?
        var oAuthClientId = '54d2028ceabc88600a8b4567_qss71wwodiosk84gk4gwwk8s40k48wgg0cgkw8wwkwwgkcg44';
        var oAuthClientSecret = '5o808pbhkw84kcwggocc0ogos8c44socccgc0880koggoc08sk';

        var oAuth = {};

        /**
         * @description
         * Check if the user is authenticated
         *
         * @returns {boolean}
         */
        oAuth.isAuthenticated = function () {
            return !!oAuthSession.username;
        };

        /**
         * @description
         * Be careful, if the user is authenticated it will also be anonymous
         *
         * @returns {boolean}
         */
        oAuth.isAnonymous = function () {
            return !!oAuthSession.authenticated_anonymously;
        };

        /**
         * @param {accessToken}
         * @param {createSession} Want to already register it at oAuthSession?
         * @returns {*}
         */
        oAuth.getInfo = function (accessToken, createSession) {
            var userInfo = null;
            createSession = createSession || false;

            $http.get('/api/user/info',
                {
                    params: {
                        access_token: accessToken
                    }
                })
                .success(function (data) {
                    userInfo = data;
                    userInfo.access_token = accessToken;

                    if (true === createSession) oAuthSession.create(userInfo);
                });

            return userInfo;
        };

        oAuth.logout = function (force) {

            var forceLogout = function () {
                $cookieStore.remove('PHPSESSID');
                oAuthSession.destroy();
                $rootScope.$broadcast('event:auth-logoutForced');
            };

            $http.get('/logout').success(function (data) {
                if (!data.authenticated_fully) {
                    $rootScope.$broadcast('event:auth-logoutSuccess');
                    oAuthSession.destroy();
                } else {
                    $rootScope.$broadcast('event:auth-logoutError');
                }
            }).error(function () {
                $rootScope.$broadcast('event:auth-logoutReqError');
            }).finally(function() {
                if (force) {
                    forceLogout();
                }
            });

        };

        oAuth.beAnonymous = function () {
            $http.post('/oauth/v2/token',
                {
                    client_id: oAuthClientId,
                    client_secret: oAuthClientSecret,
                    grant_type: 'client_credentials'
                })
                .success(function (data) {
                    oAuth.getInfo(data.access_token, true);

                    authService.loginConfirmed('success', function (config) {
                        config.params = {access_token: data.access_token};
                        return config;
                    });
                })
                .error(function (data, status) {
                    return status;
                });
        };

        oAuth.beAuthenticated = function (data) {
            return $http.post('/oauth/v2/token',
                {
                    client_id: oAuthClientId,
                    client_secret: oAuthClientSecret,
                    username: data.username,
                    password: data.password,
                    grant_type: 'password'
                })
                .success(function (data) {
                    oAuth.getInfo(data.access_token, true);

                    authService.loginConfirmed('success', function (config) {
                        config.params = {access_token: data.access_token};
                        return config;
                    });
                })
                .error(function (data, status) {
                    $rootScope.$broadcast('event:auth-loginFail', data, status);
                    return data;
                });
        };

        return oAuth;

    }])
;