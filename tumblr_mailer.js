/**
 * Created by haileykeen on 1/6/16.
 */
var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

var contacts = csvParse(csvFile);

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

//Replacing FIRST_NAME and NUM_MONTHS_SINCE_CONTACT in email_template
contacts.forEach(function(contact) {
  var firstName = contact["firstName"];
  var numMonthsSinceContact = contact["numMonthsSinceContact"];

  var templateCopy = emailTemplate
      .replace(/FIRST_NAME/gi, firstName)
      .replace(/NUM_MONTHS_SINCE_CONTACT/gi, numMonthsSinceContact);

  console.log(templateCopy);
});
