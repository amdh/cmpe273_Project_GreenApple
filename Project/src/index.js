

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

var APP_ID = 'amzn1.ask.skill.58287cfb-48d0-49bb-ac3a-d5571e077c60';//replace with 'amzn1.echo-sdk-ams.app.[your-value]';



var http = require('http'),

    alexaSheetUtil = require('./AlexaSpreadSheetUtil');



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

        session.attributes.menuOrder = true;

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

    var speechOutput = "I am ready to place your order. "

        + repromptText;



    response.ask(speechOutput, repromptText);
}

function handleYesMenuIntentRequest(intent, session , response){

    var repromptText = "Which pizza you would like to order? ";

    var speechOutput = " I have these pizzas for you in my menu card. "
            
            + " Super Veggie  , Pepperoni  , Barbeque chicken  ,Margherita. " // getMenuListTextFromUtil() //should return text

             + repromptText;


    response.ask(speechOutput, repromptText);
}
function handleCustomMenuIntentRequest(intent, session , response){

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

       
     var repromptText = "Your custom pizza is. "+ session.attributes.crust + "crust. and has following ingredients. " + session.attributes.sauce + "sauce. "+ session.attributes.cheese + "cheese. " +session.attributes.vegtop + "in vegetarian toppings. " + session.attributes.nonvegtop + "in non vegetarian toppings. " + "Now please tell your choice of side. Garlic breadsticks. salad. chicken wings. or. none.  "; //getSidesList()-integarte with google sheet apis;
 
         var speechOutput = "You selected. "  + session.attributes.nonvegtop + "For non vegetarian toppings. " + repromptText;

    response.ask(speechOutput, repromptText);
}

function handleSidesMenuIntentRequest(intent, session , response){

    

 	var sides = intent.slots.SidesItem;
	session.attributes.sides  = sides.value;

       
     var repromptText = "Is this a pickup or delivery order. "; //getCheeseList()-integarte with google sheet apis;

         var speechOutput = "You selected " + session.attributes.sides +" in sides. " + repromptText;

    response.ask(speechOutput, repromptText);
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

        repromptText = "Please choose from regular, medium or large "

            + "Which size do you want?";

        speechOutput = "I'm sorry, I didn't understand that size. " + repromptText;



        response.ask(speechOutput, repromptText);

        return;

    }


        session.attributes.size = size.displaySize;

        getDispatchOrderRequest(intent, session, response);
       

    
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

    var repromptText = "Is this a pickup or delivery order?";

    var speechOutput = " You selected " + session.attributes.menuItem 
    
    + " with " + session.attributes.size + "size. " 
    
    + repromptText;

    response.ask(speechOutput, repromptText);

}

function handleDispatchOrderIntentRequest(intent , session , response){

    var dispatchOption = intent.slots.DispatchOption;


    if(dispatchOption && dispatchOption.value){

        if( dispatchOption.value == "delivery"){

            session.attributes.dispatchOption = dispatchOption.value;

             var repromptText = "May I know your location?";

            var speechOutput = " You selected " + session.attributes.menuItem 
            
            + " with " + session.attributes.size + "size.  "
            
            + repromptText;

            response.ask(speechOutput, repromptText);

        }
    }
        
            session.attributes.dispatchOption = "pickup";
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

        repromptText = "Please tell me your name to place an order";

        speechOutput = "Currently, we deliver at following places:  " + getSupportedLocationsText()
        
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
     
      if( session.attributes.menuItem && session.attributes.size && session.attributes.dispatchOption ){
        //var speechOutput = " Hey " + session.attributes.customerInfo + ","
        //                +" Your order has been placed."
     
        //response.tell(speechOutput);

        getFinalOrderResponse(session, response);
        
    }else{
        
        var speechOutput = " Hey " + session.attributes.customerInfo + ","
                
                        //+ " You placed : "
                        
                        //+session.attributes.menuItem + session.attributes.size + session.attributes.dispatchOption
                        
                        +" Your order seems to be incomplete."
     
        response.tell(speechOutput);
        
    }
     
    
    
   
}



    // place the order and return comeplete response
function getFinalOrderResponse(session , response) {


    var orderResult = placeOrderRequest(session.attributes.menuItem, session.attributes.size, session.attributes.dispatchOption ,session.attributes.customerInfo);
    
    
        var speechOutput;



        if (orderResult.err) {

            speechOutput = "Sorry, the GreenApple PizzaCorner service is experiencing a problem. Please try again later";

        } else {

            speechOutput = " Hey " + session.attributes.customerInfo + ","
            
                + " Your order has been placed. "

                + " You order is:"

                +  session.attributes.size  + session.attributes.menuItem + " pizza. "

                + " You chose " + session.attributes.dispatchOption +" option. "

                + " Your total bill amount is " + orderResult.price + ". "

                + " Your order will be ready in ten minutes. "  

                + " Thank you for choosing GreenApple PizzaCorner. Have a nice day. ";

           
        }


        response.tell(speechOutput);

    

}


//place order request by storing the order in spreadsheet, and respond to the user
function placeOrderRequest(menuItem, size, dispatchOption , customerName ){

    // place the order in spreadsheet and get the price
  
    return {
    
            price: "ten dollars" //alexaDateUtil.getFormattedTime(new Date(firstHighTide.t))
    }


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

        locText += loc + ", ";

    }

    return locText;

}

// Create the handler that responds to the Alexa Request.

exports.handler = function (event, context) {

    var greenApplePizzaSkill = new GreenApplePizzaSkill();

    greenApplePizzaSkill.execute(event, context);

};
