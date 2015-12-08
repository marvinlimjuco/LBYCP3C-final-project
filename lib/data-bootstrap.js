/**
 * Created by NazIsEvil on 24/10/2015.
 */
if (Meteor.isServer) {
    if (Meteor.users.find().count() === 0) {
        Accounts.createUser({
            username: 'admin',
            email: 'admin@gmail.com',
            password: 'admin',
            profile: {
                first_name: 'admin',
                last_name: 'admin',
                company: 'admin'
            }
        });
    }
}