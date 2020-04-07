// Declare
const HomeAssistant = require('homeassistant'),
config = require(`./config.json`)
host = config.host
http = require('http'), // Import Node.js core module
hass = new HomeAssistant({
  host: host,
  port: `8123`,
  token: config.token,
  ignoreCert: true
}),
//list of icons to use
tempSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M416 0c-52.9 0-96 43.1-96 96s43.1 96 96 96s96-43.1 96-96s-43.1-96-96-96zm0 128c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32zm-160-16C256 50.1 205.9 0 144 0S32 50.1 32 112v166.5C12.3 303.2 0 334 0 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-34-12.3-64.9-32-89.5V112zM144 448c-44.1 0-80-35.9-80-80c0-25.5 12.2-48.9 32-63.8V112c0-26.5 21.5-48 48-48s48 21.5 48 48v192.2c19.8 14.8 32 38.3 32 63.8c0 44.1-35.9 80-80 80zm16-125.1V112c0-8.8-7.2-16-16-16s-16 7.2-16 16v210.9c-18.6 6.6-32 24.2-32 45.1c0 26.5 21.5 48 48 48s48-21.5 48-48c0-20.9-13.4-38.5-32-45.1z" fill="white"/></svg>`,
humidSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.78em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1580 2040"><path d="M0 1252q0-141 77-323.5T275 575Q525 245 708 77l80-77q40 42 88 77q66 67 201 222.5T1308 582q114 162 193 346.5t79 323.5q0 160-62 305.5T1350.5 1809T1098 1977.5T788 2040q-160 0-305.5-60.5t-251.5-165t-168.5-251T0 1252zm241-313q0 133 56 212t170 79q115 0 171.5-78.5T696 939q-1-134-57.5-213T467 647q-114 0-170 79t-56 213zm168 0q0-24 .5-37t2-35t5-34.5t9.5-26t16.5-19.5t24.5-6q22 0 35 13t18.5 41t6.5 48t1 56t-1 55.5t-6.5 47.5t-18.5 41t-35 13q-14 0-24.5-6t-16.5-19.5t-9.5-26t-5-34.5t-2-34.5t-.5-36.5zm62 827h141l532-1146h-144zm459-319q2 134 58.5 213t170.5 79q115 0 170.5-78.5T1386 1447q-1-134-56.5-212.5T1159 1156q-114 0-170.5 78.5T930 1447zm168 0q0-36 1-55.5t6.5-47.5t18.5-41t35-13q15 0 25.5 6t17 20t10.5 25.5t5 34.5l1.5 34.5l.5 36.5q0 26-.5 37.5l-1.5 34.5l-5 34.5l-10.5 25.5l-17 20l-25.5 6q-22 0-35-13t-18.5-41t-6.5-48t-1-56z" fill="white"/></svg>`,
onSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M17 10a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-3a5 5 0 0 1 5 5a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5a5 5 0 0 1 5-5h10M7 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3a3 3 0 0 0-3-3H7z" fill="white"/></svg>`,
offSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M7 10a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m10-3a5 5 0 0 1 5 5a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5a5 5 0 0 1 5-5h10M7 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3a3 3 0 0 0-3-3H7z" fill="white"/></svg>`,
pressureSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.84em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1562 1873"><path d="M0 781q0-159 62-304t167-249T478.5 62T781 0q159 0 303.5 62t249 166.5t166.5 249t62 303.5q0 259-153.5 462.5T1013 1522v351H561v-347q-247-72-404-278T0 781zm172 0q0 248 180 426q178 179 429 179q165 0 305.5-81t222.5-220.5t82-303.5q0-123-48.5-235.5t-130.5-194t-195-130T781 173t-235.5 48.5t-194.5 130t-130.5 194T172 781zm62 38v-77h231v77H234zm116-377l56-55l162 162l-55 56zm270 526q0-67 46.5-116T780 801l291-479l70 37l-215 515q28 40 28 94q0 70-49 118.5T786 1135q-69 0-117.5-48.5T620 968zm140-498V239h74v231h-74zm313 348v-79h231v79h-231z" fill="white"/></svg>`
// Setup our webserver
server = http.createServer(async function (req, res) {   //create web server
  if (req.url == '/') { //check the URL of the current request
    // Setup the data we want to pull &
    // format our message
    (interval = async () => {
    let temp = `${(await hass.states.get('sensor', `Temperature`)).state}`
    let humid = `${(await hass.states.get('sensor', `Humidity`)).state}`
    let pressure = `${(await hass.states.get('sensor', `Pressure`)).state}`
      // set response header
    
      res.writeHead(200, { 'Content-Type': 'text/html' }); 
    
     // set response content    
    res.write(`<html><head>
    <script>
    setTimeout(function(){
      window.location.reload(1);
   }, 5000);
    </script>
    <script src="https://code.iconify.design/1/1.0.5/iconify.min.js"></script><head>
      <body><body bgcolor="#000000">
      ${tempSVG}<font color="white">${await temp}</font>
      ${humidSVG}<font color="white">${await humid}</font>
      </p>
      </body></html>`);
    //res.end();
    setTimeout(interval, `1000`);
  })();
  }
  else
    res.end('Invalid Request!');
  
});

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')