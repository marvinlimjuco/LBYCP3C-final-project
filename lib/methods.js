Meteor.methods({
    checkUser: function () {
        if (!Meteor.user()) {
            throw new Meteor.Error(401, "unauthorized", "You need full authentication");
        }
        return true;
    },
    addSurveyItem: function (itemImage, itemGroup) {
        check(itemImage, String);
        check(itemGroup, String);

        if (!Meteor.user()) {
            Images.remove({_id: itemImage});
            throw new Meteor.Error(401, "unauthorized", "You need full authentication");
        }

        SurveyItems.insert({image_id: itemImage, item_group_id: itemGroup});
    },
    deleteSurveyItem: function (itemId) {
        Meteor.call('checkUser');

        check(itemId, String);

        var item = SurveyItems.findOne({_id: itemId});
        Images.remove({_id: item.image_id});
        SurveyItems.remove({_id: itemId});
    },
    addItemGroup: function (groupName) {
        Meteor.call('checkUser');

        check(groupName, String);
        var groupNameLowered = groupName.toLowerCase();
        var itemGroup = SurveyItemGroups.find({$where: "this.groupName.toLowerCase().indexOf('" + groupNameLowered + "') >= 0"}).count();
        if (itemGroup > 0) {
            throw new Meteor.Error(500, 'group-exist', "Item Group Already Exists");
        }
        SurveyItemGroups.insert({groupName: groupName});
    },
    deleteSurveyItemGroup: function (groupId) {
        Meteor.call('checkUser');

        check(groupId, String);
        SurveyItemGroups.remove({_id: groupId});
    },
    getRandomItem: function (respondent) {
        var answeredId = SurveyAnswers.find({respondent: respondent}, {
            fields: {
                item_id: 1,
                _id: 0
            }
        }).map(function (obj, index, cur) {
            return obj.item_id;
        });
        var availableItems = SurveyItems.find({_id: {$nin: answeredId}});
        var index = Meteor.call('generateRandomIndex', 0, availableItems.count());
        return availableItems.map(function (obj, index, cur) {
            return obj._id
        })[index];

    },
    generateRandomIndex: function (min, max) {
        return Math.floor(Random.fraction() * (max - min)) + min;
    },
    answerSurvey: function (respondent, item, vividness, detail, appeal) {
        vividness = vividness ? parseInt(vividness) : 0;
        detail = detail ? parseInt(detail) : 0;
        appeal = appeal ? parseInt(appeal) : 0;
        SurveyAnswers.insert({
            respondent: respondent,
            item_id: item,
            vividness: vividness,
            detail: detail,
            appeal: appeal
        });
    },
    totalAvg: function (groupId) {
        var items = SurveyItems.find({item_group_id: groupId}, {fields: {_id: 1}}).map(function (obj, index, cur) {
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

        return {
            respondents: totalRespondents,
            vividness: (vividnessTotal / (vividnessCount$5 + vividnessCount$4 + vividnessCount$3 + vividnessCount$3 + vividnessCount$2 + vividnessCount$1)).toFixed(2),
            detail: (detailTotal / (detailCount$5 + detailCount$4 + detailCount$3 + detailCount$3 + detailCount$2 + detailCount$1)).toFixed(2),
            appeal: (appealTotal / (appealCount$5 + appealCount$4 + appealCount$3 + appealCount$3 + appealCount$2 + appealCount$1)).toFixed(2),
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

    }
});
