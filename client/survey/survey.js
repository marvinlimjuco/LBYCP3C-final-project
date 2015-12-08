/**
 * Created by NazIsEvil on 25/10/2015.
 */
Template.surveyWelcome.onCreated(function () {
    Session.set('respondent', undefined);
});

Template.surveyWelcome.events({
    'submit #respondentForm': function (event, template) {
        event.preventDefault();
        Session.set('respondent', event.target.respondent.value);
        Meteor.call('getRandomItem', event.target.respondent.value, function (err, data) {
            if (data !== undefined) {
                Session.set('timer',18);
                Session.set('currentItem', data);
                Router.go("/survey");
            }else{
                Router.go("/survey-finished")
            }
        });
    }
});

var timerFn = function (templInstance, timerInstance) {
    var n = Session.get('timer');
    if (n === -1 || n === undefined) {
        Meteor.clearInterval(timerInstance);
    } else if (n > 0) {
        Session.set('timer', --n);
    } else {
        Session.set('timer', 18);
        $(templInstance.find('#respondentForm')).trigger('submit');
    }
};

var removeBlackout = function () {
    $('html').removeClass('blackout');
};

Template.survey.onCreated(function () {
    Session.set('timer', 18);
    var templInstance = this;
    $('html').addClass('blackout');
    var timerInstance = Meteor.setInterval(function () {
        timerFn(templInstance, timerInstance);
    }, 1000);
    Meteor.setTimeout(removeBlackout, 3000);
});

Template.survey.events({
    'submit #respondentForm': function (event, template) {
        event.preventDefault();
        $('html').addClass('blackout');
        Meteor.call('answerSurvey', Session.get('respondent'), Session.get('currentItem'), event.target.vividness.value, event.target.detail.value, event.target.appeal.value, function (err) {
            if (err) console.log(err);
            Meteor.call('getRandomItem', Session.get('respondent'), function (err, data) {
                if (data !== undefined) {
                    Session.set('currentItem', data);
                    Session.set('timer', 18);
                }else{
                    Session.set('currentItem', undefined);
                    Session.set('timer', undefined);
                    Session.set('respondent', undefined);
                    Router.go("/survey-finished");
                }
            });
        });

        event.target.reset();
        Meteor.setTimeout(removeBlackout, 3000);
    }
});

Template.survey.helpers({
    'currentItem': function () {
        var id = Session.get('currentItem');
        var item = SurveyItems.findOne({_id: id});
        if (item) {
            var image = Images.findOne({_id: item.image_id});
            return {image: {name: image.original.name, url: image.url()}, itemId: id};
        }
    },
    'timer': function () {
        return Session.get('timer');
    }
});

Template.surveyFinished.events({
    'click #newRespondent': function(event, template){
        Session.set('currentItem', undefined);
        Session.set('timer', undefined);
        Session.set('respondent', undefined);
        Router.go('/')
    }
});