/**
 * Created by NazIsEvil on 24/10/2015.
 */
SurveyItems = new Mongo.Collection('survey_items');
SurveyItemGroups = new Mongo.Collection('survey_item_groups');
SurveyAnswers = new Mongo.Collection('survey_answers');

Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: "/uploads"})]
});