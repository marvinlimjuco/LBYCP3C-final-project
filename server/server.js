Images.allow({
    'insert': function () {
        if (Meteor.user()) {
            return true;
        } else {
            return false;
        }
    }
});
