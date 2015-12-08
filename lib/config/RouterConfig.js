Router.configure({
    layoutTemplate: 'main'
});
Router.route("/", function () {
    if (Meteor.user()) {
        this.render('dashboard');
    } else {
        this.render('surveyWelcome');
    }
});
Router.route("/results", function () {
    this.render('resultsDashboard');
});
Router.route("/maintenance/survey-items", function () {
    this.render('surveyItem');
});

Router.route("/maintenance/survey-item-groups", function () {
    this.render('surveyItemGroups');
});

Router.route("/survey", function () {
    this.render('survey');
});
Router.route("/survey-finished", function () {
    this.render('surveyFinished');
});

Router.route("/results/:_id", {
    template: 'individualResults',
    data: function () {
        return SurveyItemGroups.findOne({_id: this.params._id});;
    }
});
