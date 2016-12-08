var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

module.exports = { google_spreadsheet_custom_menu : function(callbackMethod){
// spreadsheet key is the long id in the sheets URL 
var doc = new GoogleSpreadsheet('1axeSHnFyNADHaJxdsG39BAPEa36jdNY01AONaUp8LRU');
var sheet;
var sheet1
 
async.series([
  function setAuth(step) {
    // see notes below for authentication instructions! 
    var creds = require('./creds.json');
    // OR, if you cannot save the file locally (like on heroku) 
    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      sheet1 = info.worksheets[1];
      //console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();
    });
  },function workingWithCells(step) {
        sheet1.getCells({
          'min-row': 1,
          'max-row': 9,
          'return-empty': false
        }, function(err, cells) {
          var custom_menu = {}
          cells.forEach(function(cell, index){
             //console.log(cells[index+1]);
             if (cell.row == 1){
                if (cell.col % 2 != 0){
                   custom_menu[cell["_value"]] = {} 
                }
             }
             else if (cell.col == 1){
              custom_menu["crust"][cell["_value"]] =  cells[index + 1]["_value"]
             }else if(cell.col == 3){
              custom_menu["sauce"][cell["_value"]] =  cells[index+1]["_value"]
             }else if(cell.col == 5){
              custom_menu["cheese"][cell["_value"]] =  cells[index+1]["_value"]
             }else if(cell.col == 7){
              //console.log( cells[index+1]["_value"])
              custom_menu["size"][cell["_value"]] =  cells[index+1]["_value"]
             }else if(cell.col == 9){
              custom_menu["vegtopping"][cell["_value"]] =  cells[index+1]["_value"]
             }else if(cell.col == 11){
              custom_menu["nonvegtopping"][cell["_value"]] =  cells[index+1]["_value"]
             }else if(cell.col == 13){
              custom_menu["sides"][cell["_value"]] =  cells[index+1]["_value"]
             }
          })
          //console.log("Custom menu ::: " + JSON.stringify(custom_menu))
          callbackMethod(custom_menu);
          step();
        });
      }
]);
}, google_spreadsheet_menu : function(callbackMethod){
// spreadsheet key is the long id in the sheets URL 
var doc = new GoogleSpreadsheet('1axeSHnFyNADHaJxdsG39BAPEa36jdNY01AONaUp8LRU');
var sheet;
var sheet1;
 
async.series([
  function setAuth(step) {
    // see notes below for authentication instructions! 
    var creds = require('./creds.json');
    // OR, if you cannot save the file locally (like on heroku) 
    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      sheet1 = info.worksheets[1];
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
        var pizza_name = ""
        pizza_menu.forEach(function(item, index){
        //console.log("gettin pizza name and giving to user")
        if (index != pizza_menu.length-1)
            pizza_name += item + ", "
        else
            pizza_name += item + ". "
        });
        
      callbackMethod(null, pizza_price) 
    });
  }]);
}}