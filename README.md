# NodeJS-WeatherApplication
Navigate to the root folder and start the application with node index.js.

## How to Use 

 * A detailed way which can be accessed by using the GUI interface and navigating to localhost:3000  
 * A simple way which can be accessed by sending data to the endpoint http://localhost:3000/weatherapi?city=Raleigh&units=Standard  
  * city can be a zip code or city name  
  * units can be Standard, Imperial or Metric  
  
## Map Overlay
 * The map on the detailed page may take a little while to load the data, and really only displays weather data for certain countries
 * Navigation is a lot smoother using the navigation buttons rather then dragging to move
 * The map overlay API is done by http://www.wxtiles.com/ and requires a free registration to use on any site other then localhost
