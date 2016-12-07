

/**

 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:

 * Asks your pizza order

* Provides your menu

 *Places pizza order

 * Examples:

 
 * Dialog model:

 *  User:  "Alexa, Ask GreenApple PizzaCorner to place my pizza order"

 *  Alexa: "Welcome to GreenApple PizzaCorner. Do you want to choose from menu or order a custom pizza?"

 *  User:  "I want to know the menu"

 *  Alexa: "Todays menu is..."


 */



/**

 * App ID for the skill

 */

var APP_ID = 'amzn1.ask.skill.d8bde69b-47ed-4226-9f3b-18a7b6f6abac';//replace with 'amzn1.echo-sdk-ams.app.[your-value]';



var http = require('http'),
alexaSheetUtil = require('./AlexaSpreadSheetUtil');

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// Update this line with your Google sheet ID
var doc = new GoogleSpreadsheet('1Si4XXD0PbMqa-QvNhkjSuhkacZJaQR9Hbp5HZKan4Tk')//('1axeSHnFyNADHaJxdsG39BAPEa36jdNY01AONaUp8LRU'); shafi
var menuSheet;
var orderSheet;


var AlexaSkill = require('./AlexaSkill');



/**

 * GreenApplePizzaSkill is a child of AlexaSkill.

 * To read more about inheritance in JavaScript, see the link below.

 */

var GreenApplePizzaSkill = function () {

    AlexaSkill.call(this, APP_ID);

};



// Extend AlexaSkill

GreenApplePizzaSkill.prototype = Object.create(AlexaSkill.prototype);

GreenApplePizzaSkill.prototype.constructor = GreenApplePizzaSkill;



// ----------------------- Override AlexaSkill request and intent handlers -----------------------



GreenApplePizzaSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {

    console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId

        + ", sessionId: " + session.sessionId);

    // any initialization logic goes here

};



GreenApplePizzaSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {

    console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

    handleWelcomeRequest(response);

};



GreenApplePizzaSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {

    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId

        + ", sessionId: " + session.sessionId);

    // any cleanup logic goes here

};



/**

 * override intentHandlers to map intent handling functions.

 */

GreenApplePizzaSkill.prototype.intentHandlers = {

    "OrderPizzaIntent": function (intent, session, response) {

        handleOrderPizzaIntentRequest(intent, session, response);

    },

    "YesMenuIntent": function (intent, session, response) {
    
       handleYesMenuIntentRequest(intent, session, response);       

    },

    "CustomMenuIntent": function (intent, session, response) {

        handleCustomMenuIntentRequest(intent, session, response);

    },

    "CrustIntent": function (intent, session, response) {

        handleCrustMenuIntentRequest(intent, session, response);

    },

    "SauceIntent": function (intent, session, response) {

        handleSauceMenuIntentRequest(intent, session, response);

    },

    "CheeseIntent": function (intent, session, response) {

        handleCheeseMenuIntentRequest(intent, session, response);

    },

    "VegToppingsIntent": function (intent, session, response) {

        handleVegToppingsMenuIntentRequest(intent, session, response);

    },

    "NonVegToppingsIntent": function (intent, session, response) {

        handleNonVegToppingsMenuIntentRequest(intent, session, response);

    },

    "SidesIntent": function (intent, session, response) {

        handleSidesMenuIntentRequest(intent, session, response);

    },

    "MenuItemIntent" :  function (intent , session, response){
        
         handleMenuItemDialogRequest(intent, session, response);
    },

    "SizeIntent" : function (intent , session, response){

         handleSizeDialogRequest(intent, session, response);
    },


    "DialogMenuItemIntent" : function (intent , session, response){

        var menuItem = intent.slots.MenuItem;
        var size = intent.slots.size;

        if (menuItem && menuItem.value) {

                handleMenuItemDialogRequest(intent, session, response);

            } else if (size && size.value) {

                handleSizeDialogRequest(intent, session, response);

            } else {

                handleNoSlotDialogRequest(intent, session, response);

            }
    },


    "DispatchOrderIntent" : function(intent , session , response){

            handleDispatchOrderIntentRequest(intent , session , response);
    },


    "AddressIntent" : function( intent , session , response){

        var address = intent.slots.Address;

        if( address && address.value){

            handleAddressIntentRequest(intent , session , response);
        }else{

            handleNoAddressRequest( intent , session , response);
        }
    },

    "CustomerInfoIntent" : function(intent , session , response){

        handleCustomerInfoIntentRequest(intent , session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {

        handleHelpRequest(response);

    },



    "AMAZON.StopIntent": function (intent, session, response) {

        session.attributes = "";
        var speechOutput = "Thanks for contacting GreenApple PizzaCornder. Have a nice day";

        response.tell(speechOutput);

    },



    "AMAZON.CancelIntent": function (intent, session, response) {

        session.attributes = "";
        var speechOutput = "Thanks for contacting GreenApple PizzaCornder. Goodbye";

        response.tell(speechOutput);

    }

};



// -------------------------- GreenApplePizzaSkill Domain Specific Business Logic --------------------------


function handleWelcomeRequest(response) {

    var menuPrompt = " To proceed with order, you can say choose from menu or build custom pizza?",

        speechOutput = "Welcome to GreenApple PizzaCorner." 

                    + menuPrompt;
        
        repromptOutput = {

            speech: "I can lead you through placing your pizza order at GreenApple PizzaCorner."

            + " How can I proceed with your order, choose from menu or build custom pizza?"
            
            + menuPrompt,

            type: AlexaSkill.speechOutputType.PLAIN_TEXT

        };

    auth_sheet();

    response.ask(speechOutput, repromptOutput);

}



function handleHelpRequest(response) {

    var repromptText = "Do you want to order from menu or build custom pizza?";

    var speechOutput = " I can lead you through placing your pizza order at GreenApple PizzaCorner."

        + " You can choose pizza from meny or build your custom pizza ."
      
        + " Tell me your choice."

        + repromptText;



    response.ask(speechOutput, repromptText);

}

function handleOrderPizzaIntentRequest(intent, session, response){

     var repromptText = " Lets proceed with your order, you want to choose pizza from menu or build your custom pizza? ";

                    //+ " What would you like to do?" ;

    var speechOutput = "Welcome to GreenApple PizzaCorner. I am ready to place your order. "

        + repromptText;

    response.ask(speechOutput, repromptText);
}

function handleYesMenuIntentRequest(intent, session , response){

       session.attributes.orderType = "menuorder";
        var repromptText = "Which pizza you would like to order? ";
        var speechOutput = " I have these pizzas for you in my menu card. "

        var pizza_name = ""
        menuResponse(speechOutput, function(err, output){
            speechOutput +=  output + repromptText;
            response.ask(speechOutput, repromptText);
        });
}
function handleCustomMenuIntentRequest(intent, session , response){

    session.attributes.orderType = "customorder";

    var repromptText = "Please tell your choice of crust. Normal. Thin. Or Brooklyn"; //getCrustList()-integarte with google sheet apis;

    var speechOutput = "Lets start making your pizza.   "

             + repromptText;



    response.ask(speechOutput, repromptText);
}

function handleCrustMenuIntentRequest(intent, session , response){

    

 	var crust = intent.slots.CrustItem;
	session.attributes.crust  = crust.value;

       
       var repromptText = "Now please tell your choice of sauce. Marinara. Alfedo. Or Pesto"; //getSauceList()-integarte with google sheet apis;

         var speechOutput = "You selected " + session.attributes.crust +" crust. " + repromptText;

    response.ask(speechOutput, repromptText);
}

function handleSauceMenuIntentRequest(intent, session , response){

    

 	var sauce = intent.slots.SauceItem;
	session.attributes.sauce  = sauce.value;

       
     var repromptText = "Now please tell your choice of cheese. Mozarella. Parmesan. and. Parmigiano Reggiano"; //getCheeseList()-integarte with google sheet apis;

         var speechOutput = "You selected " + session.attributes.sauce +" sauce. " + repromptText;

    response.ask(speechOutput, repromptText);
}

function handleCheeseMenuIntentRequest(intent, session , response){

    

 	var cheese = intent.slots.CheeseItem;
	session.attributes.cheese  = cheese.value;

       
     var repromptText = "Now please tell your choice of vegetarian toppings. onion. tomato. greenpeppers. jalapeno. olives. mushrooms. or none. "; //getToppingsList()-integarte with google sheet apis;

         var speechOutput = "You selected " + session.attributes.cheese +" cheese. " + repromptText;

    response.ask(speechOutput, repromptText);
}

function handleVegToppingsMenuIntentRequest(intent, session , response){

    

 	var vegtop = intent.slots.VegToppingsItem;
	session.attributes.vegtop  = vegtop.value;

       
     var repromptText = ". Now please tell your choice of non vegetarian toppings. ham. pepperoni. bacon. chicken. none. "; //getVegToppingsList()-integarte with google sheet apis;

         var speechOutput = "For vegetarian toppings you selected. " + session.attributes.vegtop + repromptText;

    response.ask(speechOutput, repromptText);
}

function handleNonVegToppingsMenuIntentRequest(intent, session , response){
    

 	var nonvegtop = intent.slots.NonVegToppingsItem;

	session.attributes.nonvegtop  = nonvegtop.value;

    var repromptText = "Which size do you want ?";

      
     var speechOutput = "Your custom pizza is. "+ session.attributes.crust 
     
     + "crust. and has following ingredients. " + session.attributes.sauce 
     
     + "sauce. "+ session.attributes.cheese + "cheese. " 
     
     +session.attributes.vegtop + "in vegetarian toppings. " 
     
     + session.attributes.nonvegtop + "in non vegetarian toppings. " 
     
     + repromptText;

    response.ask(speechOutput, repromptText);
}

function handleSidesMenuIntentRequest(intent, session , response){

	var sides = intent.slots.SidesItem;

	session.attributes.sides  = sides.value;

    getDispatchOrderRequest(intent, session, response);
   
}


function handleMenuItemDialogRequest(intent, session , response){
    //check if menuitem is present in the menu list
    //if no give the error and tell the menu again
    //if no save the menuitem and ask for size

    var menu = getMenuFromUtil(intent, true), // check if he menu is present in menulist

        repromptText,

        speechOutput;

 if (menu.error) {

        repromptText = "Currently, my menu card has these pizzas. " + getMenuListTextFromUtil()

            + "Which pizza you want to order?";

        // if we received a value for the incorrect city, repeat it to the user, otherwise we received an empty slot

        speechOutput = menu.menuItem ? "I'm sorry, I don't have  " +  menu.menuItem + ". " + repromptText : repromptText;

        response.ask(speechOutput, repromptText);
Z
        return;

    }

if (session.attributes.size) {

         getDispatchOrderRequest(session.attributes.menuItem, size, response);

    } else {

        // set menu in session and prompt for size

        session.attributes.menuItem = menu.displayMenu;

       
        repromptText = "Which size do you want for " + menu.displayMenu + "?";

         speechOutput = "You selected " + menu.displayMenu +" pizza. " + repromptText;



        response.ask(speechOutput, repromptText);

    }
}

function handleSizeDialogRequest(intent, session , response){

     var size = getSizeFromUtil(intent, true),

        repromptText,

        speechOutput;

    if (!size) {

        repromptText = "Please choose from small , medium , large or extralarge "

            + "Which size do you want?";

        speechOutput = "I'm sorry, I didn't understand that size. " + repromptText;



        response.ask(speechOutput, repromptText);

        return;

    }

        repromptText = "Choose the one. ";
        
        speechOutput = "Now please tell your choice of side. Garlic breadsticks. salad. chicken wings or none.  ";

        session.attributes.size = size.displaySize;

        response.ask(speechOutput, repromptText);

       // getDispatchOrderRequest(intent, session, response);
       

    
}

/**

 * Handle no slots, or slot(s) with no values.

 * In the case of a dialog based skill with multiple slots,

 * when passed a slot with no value, we cannot have confidence

 * it is the correct slot type so we rely on session state to

 * determine the next turn in the dialog, and reprompt.

 */

function handleNoSlotDialogRequest(intent, session, response) {

        var repromptText = "Please try again telling pizza name from the menu, for example , Pepperoni pizza. ";

        var speechOutput = "Sorry, I could not get your choice." + repromptText;

        response.ask(speechOutput, repromptText);

}

// ask for pickup or delivery
function getDispatchOrderRequest(intent, session, response){

    var repromptText = "So is this a pickup or delivery order?";

    var speechOutput =  "You selected " + session.attributes.sides +" in sides. " 

                        + repromptText;

    response.ask(speechOutput, repromptText);

}


function handleDispatchOrderIntentRequest(intent , session , response){

    var dispatchOption = intent.slots.DispatchOption;


    if(dispatchOption && dispatchOption.value){

        if( dispatchOption.value == "delivery"){

            session.attributes.dispatchOption = dispatchOption.value;

                var repromptText = "May I know your location?";

                var speechOutput = "Okay.  "
                
                + repromptText;

                response.ask(speechOutput, repromptText);       

            
        }
    }
        
            session.attributes.dispatchOption = "pickup";
            session.attributes.location = "-";
            // default is pickup
            getCustomerInfo(intent , session , response);

    
}


//handles tasks after address is given by the user
function handleAddressIntentRequest(intent , session , response){
    
    var location = getAdressFromUtil(intent, false),

        repromptText,

        speechOutput;

        //if location is not supported
    if (location.error) {

        session.attributes.dispatchOption = "pickup";
        session.attributes.location = "-";

        repromptText = "Please tell me your name to place an order";

        speechOutput = "Currently, GreenApple PizzaCorner deliver at following places:  " + getSupportedLocationsText()
        
        + "I'm sorry, GreenApple PizzaCorner do not deliver in that location. "
        
        + " You will have to pickup from PizzaCorner." + repromptText;

        response.ask(speechOutput, repromptText);

    }else{

        session.attributes.location = location.displayLocation;

        getCustomerInfo(intent , session , response);
    }
       
    
    
}


//if no address is given
function handleNoAddressRequest( intent , session , response){

        var repromptText = "Please tell me your location again. ";

        var speechOutput = "Sorry, I could not get your location." + repromptText;

        response.ask(speechOutput, repromptText);
}

//ask for customer name
function getCustomerInfo(intent , session , response){

 var repromptText = "Please tell me your name.";

    var speechOutput = " We are almost done with placing your pizza order.  " 
    
    +repromptText;

    response.ask(speechOutput, repromptText);

}

//once name is given place final order and respond with price
function handleCustomerInfoIntentRequest( intent , session , response){

     var custName = intent.slots.CustomerName;

     session.attributes.customerInfo = custName.value
       
       if(session.attributes.orderType == "menuorder"){
           if( session.attributes.menuItem && session.attributes.size && session.attributes.sides && session.attributes.dispatchOption ){
               getFinalOrderResponse(session, response);
           }else{
                        var speechOutput = " Hey " + session.attributes.customerInfo + ","
                
                        //+ " You placed : "
                        
                        //+session.attributes.menuItem + session.attributes.size + session.attributes.dispatchOption
                        
                        +" Your order seems to be incomplete."
     
                        response.tell(speechOutput);

           }
       }else{
            if(session.attributes.crust && session.attributes.sauce  && session.attributes.cheese &&
                    session.attributes.vegtop && session.attributes.nonvegtop && session.attributes.size &&
                     session.attributes.sides && session.attributes.dispatchOption){

                             getFinalCustomOrderResponse(session,response);
            }               
            else{
                        var speechOutput = " Hey " + session.attributes.customerInfo + ","
                    
                        +" Your order seems to be incomplete."
     
                       response.tell(speechOutput);
            }
       
        }
   
}

// custom order response
function getFinalCustomOrderResponse(session , response){

    placeCustomOrderRequest(session.attributes.crust, session.attributes.sauce,session.attributes.cheese,
                    session.attributes.vegtop , session.attributes.nonvegtop , session.attributes.size ,
                     session.attributes.sides, session.attributes.dispatchOption, session.attributes.location,
                     session.attributes.customerInfo,
                     function orderResponseCallback(err, orderResponse){

                         var speechOutput;
    
                            if (err) {

                                    speechOutput = "Sorry, the GreenApple PizzaCorner service is experiencing a problem. Please try again later";

                                } else {
                                    
                                    speechOutput = " Your custom pizza is: "+ session.attributes.crust 
                            
                                    + " crust. and has following ingredients. " + session.attributes.sauce 
                                    
                                    + " sauce. "+ session.attributes.cheese + "cheese. " 
                                    
                                    + session.attributes.vegtop + "in vegetarian toppings. " 
                                    
                                    + session.attributes.nonvegtop + "in non vegetarian toppings "
                                    
                                    + " Its of " + session.attributes.size + " size.  " 

                                    + " And you also ordered " +session.attributes.sides +" sides. "

                                    + " You chose " + session.attributes.dispatchOption +" option. "

                                    + " Your total bill amount is " + orderResponse.price + ". "

                                    + " Your order will be ready in twenty minutes. "  

                                    + " Thank you for choosing GreenApple PizzaCorner. Have a nice day. ";

                                }
                                session.attributes = "";
                                 response.tell(speechOutput);

                     });
}



    // place the order and return comeplete response
function getFinalOrderResponse(session , response) {


     placeOrderRequest(session.attributes.menuItem, session.attributes.size,session.attributes.sides,
                     session.attributes.dispatchOption ,session.attributes.location, session.attributes.customerInfo, 
                     function orderResponseCallback(err, orderResponse){

                            var speechOutput;

                            if (err) {

                                    speechOutput = "Sorry, the GreenApple PizzaCorner service is experiencing a problem. Please try again later";

                                } else {

                                    speechOutput = " Hey " + session.attributes.customerInfo + ","
                                    
                                        + " Your order has been placed. "

                                        + " You order is:"

                                        +  session.attributes.size  + session.attributes.menuItem + " pizza. "

                                        + " You chose " + session.attributes.dispatchOption +" option. "

                                        + " Also, you chose " + session.attributes.sides + " in sides. "

                                        + " Your total bill amount is " + orderResponse.price + ". "

                                        + " Your order will be ready in ten minutes. "  

                                        + " Thank you for choosing GreenApple PizzaCorner. Have a nice day. ";

                                
                                }
                                session.attributes = "";
                                response.tell(speechOutput);

                     });
    
}

//read from 2 , add into 4
function callGoogleAPICustom(new_row, callbackResponse){
	console.log('inside google api');
	var GoogleSpreadsheet = require('google-spreadsheet');
	
	// Update this line with your Google sheet ID
	var doc = new GoogleSpreadsheet('1Si4XXD0PbMqa-QvNhkjSuhkacZJaQR9Hbp5HZKan4Tk')//('1axeSHnFyNADHaJxdsG39BAPEa36jdNY01AONaUp8LRU'); shafi
	var creds = require('./greenapple.json');
	var menuSheet;
	var orderSheet;
    var price =parseInt("0");
	
	doc.useServiceAccountAuth(creds, function(err, res){
		if(err){
			callBackRes(true,null);
		}else{
                doc.getRows(2,function( err, rows ){
				if(err){
					callbackResponse(true,null);
				}else{
				console.log('Read '+rows.length+' rows');
				for (var i = 0; i < rows.length; i++) {//othh is the header
			        var row = rows[i];
			        console.log(row);
			        // Print columns A (pizza name) and B (price), which correspond to indices 0 and 1.
			        if(new_row.crust == row.crust){
			        	console.log("found crust");
			        	price+= parseInt(row.crustprice);
			        }

                    if(new_row.sauce.toUpperCase() == row.sauce.toUpperCase())
			        	price+= parseInt(row.sauceprice);
                    
                    if(new_row["cheese"].toUpperCase() == row.cheese.toUpperCase())
			        	price+= parseInt(row.cheeseprice);
                    
                    if(new_row["vegtopping"].toUpperCase() == row.vegtopping.toUpperCase())
			        	price+= parseInt(row.vtopprice);
                    
                    if(new_row["nonvegtopping"].toUpperCase() == row.nonvegtopping.toUpperCase())
			        	price+= parseInt(row.nvtopprice);
			        
			        if(new_row["size"].toUpperCase() == row.size.toUpperCase())
			        	price+= parseInt(row.sizeprice);
			        
			        if(new_row["sides"].toUpperCase() == row.sides.toUpperCase())
			        	price+=	parseInt(row.sidesprice);
			        
			        console.log('%s, %s', row.crust, row.crustprice);
			        console.log(price);
			        
			      }
                    console.log("price:");
                    console.log(price);
                    new_row["bill"] = "$"+price;                
                    console.log(new_row);
                    //1.menuitem 2.customitem 3.menuorder 4.customorder
                    doc.addRow(4, new_row, function(err){
                    
                        if(err){
                            console.log("err in ading");
                            callbackResponse(true,null);
                        }else{
                            console.log('new row added');
                            res = { price : "$"+price}
                            callbackResponse(null,res);
                        }
                    });//need index of sheet as first param
		        }
	        }); //getrows to read price
        }
    });//authenticalte first	
}


//read from 1, add into 3
function callGoogleAPI(new_row, callbackResponse){
	console.log('inside google api');
	var GoogleSpreadsheet = require('google-spreadsheet');
	
	// Update this line with your Google sheet ID
	var doc = new GoogleSpreadsheet('1Si4XXD0PbMqa-QvNhkjSuhkacZJaQR9Hbp5HZKan4Tk')//('1axeSHnFyNADHaJxdsG39BAPEa36jdNY01AONaUp8LRU'); shafi
	var creds = require('./greenapple.json');
	var menuSheet;
	var orderSheet;
    var price =parseInt("0");
	
	doc.useServiceAccountAuth(creds, function(err, res){
		if(err){
			callBackRes(true,null);
		}else{
            doc.getRows(1,function( err, rows ){ //read menu sheet to get the price
				if(err){
					callBackRes(true,null);
				}else{
				console.log('Read '+rows.length+' rows');
				for (var i = 0; i < rows.length; i++) {//othh is the header
			        var row = rows[i];
			        console.log(row);
			        // Print columns A (pizza name) and B (price), which correspond to indices 0 and 1.
			        if(new_row["pizzaname"] == row.pizzaname)
			        	price+= parseInt(row.pizzaprice);
			        
			        if(new_row["size"] == row.size)
			        	price+= parseInt(row.sizeprice);
			        
			        if(new_row["sides"] == row.sides)
			        	price+=	parseInt(row.sidesprize);
			        
			        console.log('%s, %s', row.pizzaname, row.pizzaprice);
			        console.log(price);
			        
			      }
                    console.log("price:");
                    console.log(price);
                    new_row["bill"] = "$"+price;
                    
            
                    console.log(new_row);
                    //1.menuitem 2.customitem 3.menuorder 4.customorder
                    doc.addRow(3, new_row, function(err){
                    
                        if(err){
                            console.log("err in ading");
                            callbackResponse(true,null);
                        }else{
                            console.log('new row added');
                             res = { price :"$"+price}
                            callbackResponse(null,res);
                        }   
                    });//close addrow
		        }
	        }); //close getrows
        }    
    });	//authenticalte first close auth
}

//place order request by storing the order in spreadsheet, and respond to the user
function placeOrderRequest(menuItem, size, sides, dispatchOption , location, customerName , orderResponseCallback ){

    // place the order in spreadsheet and get the price
  
    var d = new Date();
                var date_formatted = 
                  [d.getDate(),
                   d.getMonth()+1,
                   d.getFullYear()].join('/')+', '+
                  [d.getHours(),
                   d.getMinutes()].join(':');
            
                
                var new_row ={
                		pizzaname : menuItem,
                		size : size,
                		sides : sides,	
                		dispatchoption : dispatchOption,
                        location : location,
                		customername : customerName,
                		ordertimestamp : date_formatted
                }
              
                console.log(new_row);
                callGoogleAPI(new_row, function(err,orderResponse){
                    if(err){
                         orderResponseCallback(new Error("Order failed"));
                    }else{
                         orderResponseCallback(null,orderResponse); 
                    }

                });
}

//place order request by storing the order in spreadsheet, and respond to the user
function placeCustomOrderRequest(crust, sauce, cheese , vegTop , nonvegTop,  
                                size, sides, dispatchOption , location, customerName , orderResponseCallback){

    // place the order in spreadsheet and get the price
  var d = new Date();
                var date_formatted = 
                  [d.getDate(),
                   d.getMonth()+1,
                   d.getFullYear()].join('/')+', '+
                  [d.getHours(),
                   d.getMinutes()].join(':');
            
                
                    var new_row ={
                            crust : crust,
                            sauce : sauce,
                            cheese : cheese,
                            vegtopping : vegTop,
                            nonvegtopping : nonvegTop,
                            size : size,
                            sides : sides,	
                            dispatchoption : dispatchOption,
                            location : location,
                            customername : customerName,
                            ordertimestamp : date_formatted
                    }
              
                console.log(new_row);
                callGoogleAPICustom(new_row, function(err,orderResponse){
                    if(err){
                         orderResponseCallback(new Error("Order failed"));
                    }else{
                         orderResponseCallback(null,orderResponse); 
                    }

                });

}

function getSizeFromUtil(intent, assignDefault){

var size = intent.slots.size;

    if (!size || !size.value) {

        if (!assignDefault) {

            return {

                error: true

            }

        } else {
            // For sample skill, default to Seattle.

            return {

                displaySize: 'regular'

            }

        }
    }else{
        //check size is present on menu card
         // lookup the city. Sample skill uses well known mapping of a few known cities to station id.

        var val = size.value;

        return{

            displaySize : val
        }

        /*if (STATIONS[cityName.toLowerCase()]) {

            return {

                city: cityName,

                station: STATIONS[cityName.toLowerCase()]

            }

        } else {

            return {

                error: true,

                city: cityName

            }*/

        }

}

function getMenuFromUtil(intent,assignDefault ){

    var menuItem = intent.slots.MenuItem;

    if (!menuItem || !menuItem.value) {

        if (!assignDefault) {

            return {

                error: true

            }

        } else {
            // For sample skill, default value

            return {

                displayMenu: 'Pepperoni'

            }

        }
    }else{
        //check menuitem is present on menu card
         // lookup the city. Sample skill uses well known mapping of a few known cities to station id.

        var val = menuItem.value;

        return{

            displayMenu : val
        }
     }
}

function getAdressFromUtil(intent , assignDefault){

var addr = intent.slots.Address;

    if (!addr || !addr.value) {

        if (!assignDefault) {

            return {

                error: true

            }

        } else {
            // For sample skill, default value

            return {

                displayLocation: 'sanjose'

            }

        }
    }else{
       //check if the location is in suppported location  list
       var locList = getSupportedLocations();

        var val = addr.value;

        if(locList.indexOf(val) > -1){ //location is present
            
             return {

                displayLocation : val
            }
        }
        else{

            return {

            error: true
            }

        }
      
    }

}

function getSupportedLocations(){

    var arr = [ 'sanjose' ,'milipitas' , 'santaclara'];

    return arr;

}

function getSupportedLocationsText(){

    var arr = getSupportedLocations();

   var locText = '';

    for (var loc in arr) {

        locText += arr[loc] + ", ";

    }

    return locText;

}

function menuResponse(output, callback){
    try{
       alexaSheetUtil.google_spreadsheet_menu(callback)
    }catch(err){
        callback(err)
    }   
}

// Create the handler that responds to the Alexa Request.

exports.handler = function (event, context) {

    var greenApplePizzaSkill = new GreenApplePizzaSkill();

    greenApplePizzaSkill.execute(event, context);

};
