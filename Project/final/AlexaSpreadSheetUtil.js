var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');


module.exports = {google_spreadsheet_menu : function(callbackMethod){
// spreadsheet key is the long id in the sheets URL 
var doc = new GoogleSpreadsheet('1axeSHnFyNADHaJxdsG39BAPEa36jdNY01AONaUp8LRU');
var sheet;
 
async.series([
  function setAuth(step) {
    // see notes below for authentication instructions! 
    var creds = require('./creds.json');
    // OR, if you cannot save the file locally (like on heroku) 
    var creds_json = {
      client_email: 'yourserviceaccountemailhere@google.com',
      private_key: 'your long private key stuff here'
    }
 
    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();
    });
  },
  function workingWithRows(step) {
    // google provides some query options 
    sheet.getRows({
      offset: 1,
      limit: 20,
      orderby: 'col2'
    }, function( err, rows ){
        var pizza_menu = [];
        var pizza_price = {};
        for (row in rows){
          row = parseInt(row)
          //console.log(JSON.stringify(rows))
            pizza_menu.push(rows[row]["pizzamenu"]);
            pizza_price[rows[row]["pizzamenu"]] = {
              "small": rows[row]["small"],
              "medium":rows[row]["medium"],
              "large":rows[row]["large"],
              "extralarge":rows[row]["extralarge"]
            }
        }
        var pizza_name =""
        pizza_menu.forEach(function(item, index){
        console.log("gettin pizza name and giving to user")
        if (index != pizza_menu.length-1)
            pizza_name += item + ", "
        else
            pizza_name += item + ". "
        });
        
      callbackMethod(null, pizza_name) 
    });
  }]);
}};
