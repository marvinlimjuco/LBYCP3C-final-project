/**
 * Created by NazIsEvil on 24/10/2015.
 */
Images.allow({
    'insert': function () {
        if (Meteor.user()) {
            return true;
        } else {
            return false;
        }
    }
});