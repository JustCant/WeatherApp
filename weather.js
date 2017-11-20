const https = require('https');
const http = require('http');
const api = require('./api.json');

function printError(error) {
    console.error(error.message);
}

function printMessage(weather) {
  const message = `The city of ${weather.current_observation.display_location.full} has a temperature of ${weather.current_observation.temp_f}F.`;
  console.log(message);
}

function get(query) {
    try {
        const request = https.get(`https://api.wunderground.com/api/${api.key}/conditions/q/${query}.json`, response => {
            if(response.statusCode === 200) {
                let body = "";
                response.on('data', data => {
                    body += data.toString();
                });//end response.on()
                
                response.on('end', () => {
                    try {
                        const weather = JSON.parse(body);
                        printMessage(weather);  
                    } catch (error) {
                        printError(error);
                    }//end catch
                            
                });//end response.on()
                
            } else {
                const message = `There was an error in trying to find ${query}. (${http.STATUS_CODES[response.statusCode]})`;
            }//end if...else
            
        });//end http.get()
        
        request.on('error', error => console.error(`Problem with request: ${error.message}`));
    } catch (error) {
        printError(error);
    }//end catch
    
}//end get()

module.exports.get = get;