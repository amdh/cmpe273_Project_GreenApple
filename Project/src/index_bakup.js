

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

    alexaDateUtil = require('./AlexaSpreadSheetUtil');



/**

 * The AlexaSkill prototype and helper functions

 */

var AlexaSkill = require('./AlexaSkill');



/**

 * GreenApplePizzaSkill is a child of AlexaSkill.

 * To read more about inheritance in JavaScript, see the link below.

 *

 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance

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

    "DialogMenuItemIntent" : function (intent , session, response){

        var menuItem = intent.slots.MenuItem;
        var size = intent.slots.Size;

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


    "AdrressIntent" : function( intent , session , response){

        var address = intent.slots.Address;

        if( address && address.value){

            handleAddressIntentRequest(intent , session , response);
        }else{

            handleNoAddressRequest( intent , session , response);
        }
    },


    "AMAZON.HelpIntent": function (intent, session, response) {

        handleHelpRequest(response);

    },



    "AMAZON.StopIntent": function (intent, session, response) {

        var speechOutput = "Thanks for contacting GreenApple PizzaCornder. Have a nice day";

        response.tell(speechOutput);

    },



    "AMAZON.CancelIntent": function (intent, session, response) {

        var speechOutput = "Thanks for contacting GreenApple PizzaCornder. Goodbye";

        response.tell(speechOutput);

    }

};



// -------------------------- GreenApplePizzaSkill Domain Specific Business Logic --------------------------


function handleWelcomeRequest(response) {

    var menuPrompt = " To proceed with order, you can say choose from menu or build custom pizza?",

        speechOutput = "Welcome to GreenApple PizzaCorner." 

                    + menuPrompt,
        
        /* {

            speech: "<speak>Welcome to GreenApple PizzaCorner. "

                + "<audio src='https://s3.amazonaws.com/ask-storage/tidePooler/OceanWaves.mp3'/>"

                + whichCityPrompt

                + "</speak>",

            type: AlexaSkill.speechOutputType.SSML

        },*/

        repromptOutput = {

            speech: "I can lead you through placing your pizza order at GreenApple PizzaCorner."
            
            + menuPrompt,

            type: AlexaSkill.speechOutputType.PLAIN_TEXT

        };



    response.ask(speechOutput, repromptOutput);

}



function handleHelpRequest(response) {

    var repromptText = "Do you want to order from menu or build custom pizza?";

    var speechOutput = "I can lead you through placing your pizza order at GreenApple PizzaCorner."

        + "You can choose pizza from meny or build your custom pizza ."
      
        + "Tell me your choice."

        + repromptText;



    response.ask(speechOutput, repromptText);

}

function handleOrderPizzaIntentRequest(intent, session, response){

var repromptText = " Do you want to know the menu card?";

    var speechOutput = "I am ready to place your order."

        + repromptText;



    response.ask(speechOutput, repromptText);
}

function handleYesMenuIntentRequest(intent, session , response){

    var repromptText = "Which pizza you would like to order?";

    var speechOutput = " I have these pizzas for you in my menu card."
            
            + "Super Veggie  , Pepperoni  ,\
             Barbeque chicken  ,Margherita . " // getMenuListTextFromUtil() //should return text

             + repromtText;


    response.ask(speechOutput, repromptText);
}


function handleMenuItemDialogRequest(intent, session , response){
    //check if menuitem is present in the menu list
    //if no give the error and tell the menu again
    //if no save the menuitem and ask for size

    var menu = getMenuFromUtil(intent, false), // check if he menu is present in menulist

        repromptText,

        speechOutput;

 if (menu.error) {

        repromptText = "Currently, my menu card has these pizzas: " + getMenuListTextFromUtil()

            + "Which pizza you want to order?";

        // if we received a value for the incorrect city, repeat it to the user, otherwise we received an empty slot

        speechOutput = menu.menuItem ? "I'm sorry, I don't have  " +  menu.menuItem + ". " + repromptText : repromptText;

        response.ask(speechOutput, repromptText);

        return;

    }

if (session.attributes.size) {

         getFinalMenuResponse(session.attributes.menuItem, size, response);

    } else {

        // set city in session and prompt for date

        session.attributes.menuItem = menu;

        speechOutput = "You selected" + menu.menuItem;

        repromptText = "Which size do you want for " + menu.menuItem + "?";



        response.ask(speechOutput, repromptText);

    }
}

function handleSizeDialogRequest(intent, session , response){

     var size = getSizeFromUtil(intent),

        repromptText,

        speechOutput;

    if (!size) {

        repromptText = "Please choose from small, medium or larger. "

            + "Which size do you want?";

        speechOutput = "I'm sorry, I didn't understand that size. " + repromptText;



        response.ask(speechOutput, repromptText);

        return;

    }



    // if we don't have a menuitem yet, go to menuitem. If we have a menuitem, we perform the final request

    if (session.attributes.menuItem) {

        getFinalMenuResponse(session.attributes.menuItem, size, response);

    } else {

        // The user provided a size out of turn. Set size in session and prompt for menuItem

        session.attributes.size = size;

        speechOutput = "You selected " + size.displaySize; 

        repromptText =  "Which pizza do you want with " + size.displaySize + " size?";



        response.ask(speechOutput, repromptText);

    }
}

/**

 * Handle no slots, or slot(s) with no values.

 * In the case of a dialog based skill with multiple slots,

 * when passed a slot with no value, we cannot have confidence

 * it is the correct slot type so we rely on session state to

 * determine the next turn in the dialog, and reprompt.

 */

function handleNoSlotDialogRequest(intent, session, response) {

    if (session.attributes.menuItem) {

        // get date re-prompt

        var repromptText = "Please try again telling pizza name from the menu, for example , Pepperoni pizza. ";

        var speechOutput = "Sorry, I could not get your choice." + repromptText;



        response.ask(speechOutput, repromptText);

    } else {

        // get menu card repromt

        handleMenuIntentRequest(intent, session, response);

    }

}

// ask for pickup or delivery
function getDispatchOrderRequest(intent, session, response){

    var repromtText = "Is this a pickup or delivery order";

    var speechOutput = " You selected " + session.attributes.menuItem + " with " + session.attributes.size + "size.";

    response.ask(speechOutput, repromptText);

}

function handleDispatchOrderIntentRequest(intent , session , response){

    var dispatchOption = intent.slots.DispatchOption;
        if(dispatchOption == null){
            session.attributes.dispatchOption = "pickup";
        }else
            session.attributes.dispatchOption = dispatchOption;

    if(dispatchOption){

        if( dispatchOption == "delivery"){

             var repromtText = "May I know your address?";

            var speechOutput = " You selected " + session.attributes.menuItem + " with " + session.attributes.size + "size.";

            response.ask(speechOutput, repromptText);

        }else{
        
            getCustomerInfo(intent , session , response);
         }
    }

    
}

//handles tasks after address is given by the user
function handleAddressIntentRequest(intent , session , response){
    
    getCustomerInfo(intent , session , response);
}

//if no address is given
function handleNoAddressRequest( intent , session , response){

        var repromptText = "Please tell me your address again. ";

        var speechOutput = "Sorry, I could not get your address." + repromptText;

        response.ask(speechOutput, repromptText);
}

//ask for customer name
function getCustomerInfo(intent , session , response){

 var repromtText = "Please tell me your name.";

    var speechOutput = " You selected " + session.attributes.menuItem + " with " + session.attributes.size + "size" ;

    response.ask(speechOutput, repromptText);

}

//once name is given place final order and respond with price
function handleCustomerInfoIntentRequest( intent , session , response){

    
    if( session.attributes.MenuItem && session.attributes.size && session.attributes.dispatchOption && session.attributes.customerInfo){

        getFinalOrderResponse(session.attributes.menuItem , session.attributes.size , session.attributes.dispatchOption , response);
    }
}



    // place the order and return comeplete response
function getFinalOrderResponse(menuItem, size, dispatchOption , response) {


    placeOrderRequest(menuItem, size, dispatchOption , function placeOrderResponseCallback(err, placeOrderResponse) {

        var speechOutput;



        if (err) {

            speechOutput = "Sorry, the GreenApple PizzaCorner service is experiencing a problem. Please try again later";

        } else {

            speechOutput = " Your order has been placed."

                + " You order is:"

                +  size  + menuItem + " pizza. "

                + " You chose " + dispatchOption +" option."

                + " Your total bill amount is " + placeOrderResponse.price + "."

                + " Your order will be ready in ten minutes. "  

                + " Thank you for choosing GreenApple PizzaCorner. Have a nice day.";

           
        }


        response.tell(speechOutput);

    });

}


//place order request by storing the order in spreadsheet, and respond to the user
function placeOrderRequest(menuItem, size, dispatchOption , placeOrderResponseCallback){

// place the order in spreadsheet and get the price
placeOrderResponse.price = "ten dollars";

tideResponseCallback(null, placeOrderResponse);
/*
return {

        price: "ten dollars" //alexaDateUtil.getFormattedTime(new Date(firstHighTide.t))
}
*/

}


// Create the handler that responds to the Alexa Request.

exports.handler = function (event, context) {

    var greenApplePizzaSkill = new GreenApplePizzaSkill();

    greenApplePizzaSkill.execute(event, context);

};