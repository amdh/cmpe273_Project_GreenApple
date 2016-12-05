Steps to set up Google Sheet API:

1. Create a project on Google Developers Console, Turn on Google Sheet API

2. Register Google API key

3. Install libraries:
	npm install googleapis --save
	npm install google-auth-library --save

4. Add a js file to read sheets using google sheets ID

5. run the file using “node readGoogleSheet.js” to read the menu

OR for writing into spreadsheet, execute “node writeGoogleSheet.js”


NOTE: writeGoogleSheet.js required stronger authentication so if you first ran it, no need to re-adjust your authentication rights for executing readGoogleSheet.js.
Otherwise, simply run “rm  ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json” and then, go to the below steps.


——————

Required steps after step 5:
a. Execute the Link provided in the console into browser. 
b. Copy the generated code on the browser 
c. Paste it to the CMD and press enter