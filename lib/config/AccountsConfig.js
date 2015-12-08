/**
 * Created by NazIsEvil on 24/10/2015.
 */
if (Meteor.isClient) {
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    accountsUIBootstrap3.logoutCallback = function(error) {
        if(error) console.log("Error:" + error);
        Router.go('/');
    };
    accountsUIBootstrap3.loginCallback = function(error) {
        if(error) console.log("Error:" + error);
        Router.go('/');
    };
}

if(Meteor.isServer){
    Accounts.config({
        forbidClientAccountCreation : true
    });

}