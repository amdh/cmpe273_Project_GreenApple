

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

    "OrderPizza": function (intent, session, response) {

        handleOrderPizzaRequest(intent, session, response);

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

    var menuPrompt = " Would you like to know the menu or build custom pizza?",

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

            speech: "I can lead you through placing your pizza order at GreenApple PizzaCorner. Would you like to know the menu or build custom pizza? ",

            type: AlexaSkill.speechOutputType.PLAIN_TEXT

        };



    response.ask(speechOutput, repromptOutput);

}



function handleHelpRequest(response) {

    var repromptText = "Do you want to order from menu or build custom pizza?";

    var speechOutput = "I can lead you through placing your pizza order at GreenApple PizzaCorner."

        + "You can choose pizza from meny or build your custom pizza ."
      
        + "Tell me your choice and I will give you menu."

        + repromptText;



    response.ask(speechOutput, repromptText);

}

function handleOrderPizzaRequest(intent, session, response){

var repromptText = " Would you like to know the menu or build custom pizza? ";

    var speechOutput = "I am ready to place your order."

        + repromptText;



    response.ask(speechOutput, repromptText);
}


// Create the handler that responds to the Alexa Request.

exports.handler = function (event, context) {

    var greenApplePizzaSkill = new GreenApplePizzaSkill();

    greenApplePizzaSkill.execute(event, context);

};