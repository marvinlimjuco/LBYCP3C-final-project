itemPaginator = new Paginator(SurveyItems);
itemGroupsPaginator = new Paginator(SurveyItemGroups);

Template.itemForm.onCreated(function () {
    Session.set('errorMsg', undefined);
});
Template.itemForm.events({
    'submit form#addSurveyItem': function (event, template) {
        event.preventDefault();
        var file = event.target.imageUpload.files[0];
        var itemImage;
        var itemGroup = event.target.itemGroup.value;
        Images.insert(file, function (err, obj) {
            if (err !== undefined) {
                Session.set('errorMsg', "File upload failed");
                throw Meteor.Error(500, 'upload-fail', "File upload failed");
            } else {
                Meteor.call('addSurveyItem', obj._id, itemGroup, function (err) {
                    if (err === undefined) {
                        event.target.reset();

                        Session.set('errorMsg', undefined);
                    } else {
                        Session.set('errorMsg', err.details);
                    }
                });
            }
        });
    }
});
Template.itemForm.helpers({
    itemGroups: function () {
        return SurveyItemGroups.find();
    }
});
Template.itemTable.events({
    'click .deleteItem': function (event) {
        var id = event.target.dataset.id;
        if (id === undefined) {
            id = event.target.parentNode.dataset.id;
        }

        Meteor.call('deleteSurveyItem', id);
    }
});
Template.itemTable.helpers({
    surveyItems: function () {
        return itemPaginator.find({}, {itemsPerPage: 10});
    },
    surveyItemsCount: function () {
        return SurveyItems.find({}).count();
    },
    getGroupName: function () {
        var group = SurveyItemGroups.findOne({_id: this.item_group_id});
        if (group !== undefined) {
            return group.groupName;
        }
    },
    getImage: function () {
        var image = Images.findOne({_id: this.image_id});
        if (image !== undefined) {
            return {url: image.url(), name: image.original.name};
        }
    }
});

Template.itemGroupForm.onCreated(function () {
    Session.set('errorMsg', undefined);
});

Template.itemGroupForm.events({
    'submit form#addSurveyItemGroup': function (event, template) {
        event.preventDefault();
        Meteor.call('addItemGroup', event.target.groupName.value, function (err) {
            if (err === undefined) {
                event.target.reset();
                Session.set('errorMsg', undefined);
            } else {
                Session.set('errorMsg', err.details);
            }
        });
    }
});

Template.itemGroupForm.helpers({
    errorMsg: function () {
        return Session.get('errorMsg');
    }
});

Template.itemGroupTable.helpers({
    surveyItemGroups: function () {
        return itemGroupsPaginator.find({}, {itemsPerPage: 10});
    },
    surveyItemGroupsCount: function () {
        return SurveyItemGroups.find({}).count();
    }
});

Template.itemGroupTable.events({
    'click .deleteItem': function (event) {
        var id = event.target.dataset.id;
        if (id === undefined) {
            id = event.target.parentNode.dataset.id;
        }

        Meteor.call('deleteSurveyItemGroup', id);
    }
});


Template.resultsDashboard.helpers({
    resultGroup: function () {
        return SurveyItemGroups.find({});
    }
});

Template.resultCard.helpers({
    summary: function () {
        var items = SurveyItems.find({item_group_id: this._id}, {fields: {_id: 1}}).map(function (obj, index, cur) {
            return obj._id;
        });

        var vividnessTotal = 0, vividnessCount$5 = 0, vividnessCount$4 = 0, vividnessCount$3 = 0, vividnessCount$2 = 0, vividnessCount$1 = 0;
        var detailTotal = 0, detailCount$5 = 0, detailCount$4 = 0, detailCount$3 = 0, detailCount$2 = 0, detailCount$1 = 0;
        var appealTotal = 0, appealCount$5 = 0, appealCount$4 = 0, appealCount$3 = 0, appealCount$2 = 0, appealCount$1 = 0;
        var totalRespondents = 0;

        SurveyAnswers.find({
            respondent: {$ne: '', $ne: null},
            item_id: {$in: items},
            vividness: {$ne: 0},
            detail: {$ne: 0},
            appeal: {$ne: 0}
        }).map(function (obj, index, curr) {
            totalRespondents++;
            vividnessTotal += obj.vividness;
            detailTotal += obj.detail;
            appealTotal += obj.appeal;

            vividnessCount$5 += (obj.vividness === 5) ? 1 : 0;
            vividnessCount$4 += (obj.vividness === 4) ? 1 : 0;
            vividnessCount$3 += (obj.vividness === 3) ? 1 : 0;
            vividnessCount$2 += (obj.vividness === 2) ? 1 : 0;
            vividnessCount$1 += (obj.vividness === 1) ? 1 : 0;

            detailCount$5 += (obj.detail === 5) ? 1 : 0;
            detailCount$4 += (obj.detail === 4) ? 1 : 0;
            detailCount$3 += (obj.detail === 3) ? 1 : 0;
            detailCount$2 += (obj.detail === 2) ? 1 : 0;
            detailCount$1 += (obj.detail === 1) ? 1 : 0;

            appealCount$5 += (obj.appeal === 5) ? 1 : 0;
            appealCount$4 += (obj.appeal === 4) ? 1 : 0;
            appealCount$3 += (obj.appeal === 3) ? 1 : 0;
            appealCount$2 += (obj.appeal === 2) ? 1 : 0;
            appealCount$1 += (obj.appeal === 1) ? 1 : 0;
        });

        var vCount = (vividnessCount$5 + vividnessCount$4 + vividnessCount$3 + vividnessCount$2 + vividnessCount$1);
        var v = (vividnessTotal / vCount).toFixed(2);
        var dCount = (detailCount$5 + detailCount$4 + detailCount$3 + detailCount$2 + detailCount$1);
        var d = (detailTotal / dCount).toFixed(2);
        var aCount = (appealCount$5 + appealCount$4 + appealCount$3 + appealCount$2 + appealCount$1);
        var a = (appealTotal / aCount).toFixed(2);

        return {
            average: ((parseFloat(v) + parseFloat(a) + parseFloat(d)) / 3).toFixed(2),
            respondents: totalRespondents
        };
    }
});

Template.individualResults.helpers({
    fullDetails: function () {
        var items = SurveyItems.find({item_group_id: this._id}, {fields: {_id: 1}}).map(function (obj, index, cur) {
            return obj._id;
        });

        var vividnessTotal = 0, vividnessCount$5 = 0, vividnessCount$4 = 0, vividnessCount$3 = 0, vividnessCount$2 = 0, vividnessCount$1 = 0;
        var detailTotal = 0, detailCount$5 = 0, detailCount$4 = 0, detailCount$3 = 0, detailCount$2 = 0, detailCount$1 = 0;
        var appealTotal = 0, appealCount$5 = 0, appealCount$4 = 0, appealCount$3 = 0, appealCount$2 = 0, appealCount$1 = 0;
        var totalRespondents = 0;

        SurveyAnswers.find({
            respondent: {$ne: '', $ne: null},
            item_id: {$in: items},
            vividness: {$ne: 0},
            detail: {$ne: 0},
            appeal: {$ne: 0}
        }).map(function (obj, index, curr) {
            totalRespondents++;
            vividnessTotal += obj.vividness;
            detailTotal += obj.detail;
            appealTotal += obj.appeal;

            vividnessCount$5 += (obj.vividness === 5) ? 1 : 0;
            vividnessCount$4 += (obj.vividness === 4) ? 1 : 0;
            vividnessCount$3 += (obj.vividness === 3) ? 1 : 0;
            vividnessCount$2 += (obj.vividness === 2) ? 1 : 0;
            vividnessCount$1 += (obj.vividness === 1) ? 1 : 0;

            detailCount$5 += (obj.detail === 5) ? 1 : 0;
            detailCount$4 += (obj.detail === 4) ? 1 : 0;
            detailCount$3 += (obj.detail === 3) ? 1 : 0;
            detailCount$2 += (obj.detail === 2) ? 1 : 0;
            detailCount$1 += (obj.detail === 1) ? 1 : 0;

            appealCount$5 += (obj.appeal === 5) ? 1 : 0;
            appealCount$4 += (obj.appeal === 4) ? 1 : 0;
            appealCount$3 += (obj.appeal === 3) ? 1 : 0;
            appealCount$2 += (obj.appeal === 2) ? 1 : 0;
            appealCount$1 += (obj.appeal === 1) ? 1 : 0;
        });

        var vCount = (vividnessCount$5 + vividnessCount$4 + vividnessCount$3 + vividnessCount$2 + vividnessCount$1);
        var v = (vividnessTotal / vCount).toFixed(2);
        var dCount = (detailCount$5 + detailCount$4 + detailCount$3 + detailCount$2 + detailCount$1);
        var d = (detailTotal / dCount).toFixed(2);
        var aCount = (appealCount$5 + appealCount$4 + appealCount$3 + appealCount$2 + appealCount$1);
        var a = (appealTotal / aCount).toFixed(2);

        return {
            average: ((parseFloat(v) + parseFloat(a) + parseFloat(d)) / 3).toFixed(2),
            respondents: totalRespondents,
            vividness: v,
            detail: d,
            appeal: a,
            vividnessCount: {
                $5: vividnessCount$5,
                $4: vividnessCount$4,
                $3: vividnessCount$3,
                $2: vividnessCount$2,
                $1: vividnessCount$1
            },
            detailCount: {
                $5: detailCount$5,
                $4: detailCount$4,
                $3: detailCount$3,
                $2: detailCount$2,
                $1: detailCount$1
            },
            appealCount: {
                $5: appealCount$5,
                $4: appealCount$4,
                $3: appealCount$3,
                $2: appealCount$2,
                $1: appealCount$1
            }
        };
    },
    groupItem: function (cat) {
        return SurveyItems.find({item_group_id: this._id}).map(function (obj, index, cur) {
            console.log(obj);
            var results = {count$5: 0, count$4: 0, count$3: 0, count$2: 0, count$1: 0};
            var itemImg = Images.findOne({_id: obj.image_id});
            results.image = {url: itemImg.url(), name: itemImg.original.name};

            SurveyAnswers.find({
                respondent: {$ne: '', $ne: null},
                item_id: obj._id,
                vividness: {$ne: 0},
                detail: {$ne: 0},
                appeal: {$ne: 0}
            }).forEach(function (obj) {
                var rating = obj[cat];
                results.count$5 += (rating === 5) ? 1 : 0;
                results.count$4 += (rating === 4) ? 1 : 0;
                results.count$3 += (rating === 3) ? 1 : 0;
                results.count$2 += (rating === 2) ? 1 : 0;
                results.count$1 += (rating === 1) ? 1 : 0;
            });

            return results;
        });
    }
});
