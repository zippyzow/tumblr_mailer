/**
 * Created by haileykeen on 1/6/16.
 */

var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

//this is needed to make tumblr api requests
var client = tumblr.createClient({
  consumer_key: 'xxxxx',
  consumer_secret: 'xxxxx',
  token: 'xxxxx',
  token_secret: 'xxxxx'
});

//
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

var csvFile = fs.readFileSync('friend_list.csv', 'utf8');
var contacts = csvParse(csvFile);

client.posts('haileyckeen', function(err, blog) {
  //filter the posts array with the timestamp
  var timestampFromSevenDaysAgo = getTimestampFromSevenDaysAgo();
  var latestPosts = blog.posts.filter(function(post) {
    return post.timestamp >= timestampFromSevenDaysAgo;
  });

  //create a new array of rendered emails from the contact lists
  var renderedEmails = contacts.map(function(contact) {
    return renderEmail(contact, latestPosts);
  });

  console.log(renderedEmails);
});

function getTimestampFromSevenDaysAgo() {
  //get timestamp from 7 days ago
  var numSecondsInSevenDays = 7 * 24 * 60 * 60;
  var date = new Date();
  //all timestamps are in seconds
  var currentTimestamp = date.getTime() / 1000;
  return currentTimestamp - numSecondsInSevenDays;
}

function csvParse(csvFile) {
  var allContacts = [];
  var rows = csvFile.split('\n');
  var keys = rows[0].split(',');
  for (var i = 1; i < rows.length; i++) {
    var contact = {};
    var values = rows[i].split(',');
    for (var j = 0; j < keys.length; j++) {
      contact[keys[j]] = values[j];
    }
    allContacts.push(contact);
  }
  return allContacts;
}

function renderEmail(contact, latestPosts) {
  var data = {
    firstName: contact["firstName"],
    numMonthsSinceContact: contact["numMonthsSinceContact"],
    latestPosts: latestPosts
  };
  return ejs.render(emailTemplate, data);
}