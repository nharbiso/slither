# (Sprint 2: Server) - API Proxy for CS320 by Mason Pan and Karan Kashyap

## Project Details

Repository Link: [https://github.com/cs0320-f2022/sprint-2-kkashyap-mpan11](https://github.com/cs0320-f2022/sprint-2-kkashyap-mpan11)

**Project Name**: Sprint 2 - Server
**Project Description**: This is sprint 2 for CS320. We have developed a simple API server, wherein the user can
make requests to certain endpoints and also pass in query parameters. The current API endpoints that have been implemented are `"/loadcsv"`, `"/getcsv"`, and `"weather"`.
Requests to the `/loadcsv` endpoint should load a CSV given a filepath; requests to the `/getcsv` endpoint should return the most recently loaded CSV data,
and requets to the `/weather` endpoint should return the current temperature at a given latitude
and longitude (by fetching data from the [National Weather Services API](https://www.weather.gov/documentation/services-web-api)). <br> 
This project has been designed in a manner in which developers can easily add new endpoints and datasources, to expand the functionality
of this API server.
**Team Members**: There were two team members working on this project
1. Karan Kashyap (cs login: `kkashyap`)
2. Mason Pan (cs login: `mpan11`) <br>
All parts of the functionality of the code were written together by Mason and Karan. Tests were also ideated together. The only time they worked separately is when they wrote different tests
concurrently: Mason wrote unit tests while Karan wrote integration tests and the unit tests that involved mocking of NWS API response JSON data.

**Time spent:** It took approximately 15 hours to complete this project.


## Design Choices

The codebase is split up into a few parts/groups.

1. The first part is the previously created CSVParser, which we brought over into this codebase (from Sprint 0). We did not change any of
its core functionality, but altered it a bit to make it more robust and incorporate more defensive programming. Other than that,
the CSVParser remains largely the same (see sprint 0 for more details).<br> This is located within the `csv` package. <br>

2. Next, we have the `server` package, which contains the code that is used to create the API server. This can be broken down into two smaller parts:
   1. `Server`: this class contains the main method, and as a result, it is responsible for starting the API server, defining endpoints,
   and mapping endpoints to handlers that will "`handle`" requests made to those respective endpoints. <br> Inside of `Server`, we have stored a `List<List<String>>`, which allows `LoadCSVHandler`
      and `GetCSVHandler` to share state and have access to a shared field. This field stores the most recently loaded parsed CSV file data. To access this CSV data, we have a `getCSVData` method that
      returns a copy of the CSV data that is currently loaded. There is also a `setCSVData` method, which enables us to modify this loaded CSV when new successful requests
   are made to the `/loadcsv` endpoint.
   2. `handlers`: This package contains all of our handlers, which drive the primary functionality of this project. Organized within the sub-packages
    of this package, we have the following handlers: `GetCSVHandler`, `LoadCSVHandler`, `WeatherHandler`, and `InvalidEndpointHandler`. Each of these handlers is mapped to an
    endpoint by the `Server` class, and the handler then "handles" requests that are made to that endpoint.
    Every handler that is passed into Spark with our endpoints implements the `Handler` interface, which requires the handler to have a `serialize` method. This `serialize`
    method takes in a `Map` of {string:objects} (i.e. `Map<String, Object>`) and uses Moshi to serialize it to a JSON string that we can return to the
    user. This interface also requires classes to implement the `Handle` function (since it extends the `Route` interface).
   <br> As a side note to serialization, we were originally using `Moshi` to serialize an entire class. However, it was required by the user stories
      that we create actual `Map` objects and serialize them instead. We note that this might not be the most ideal design, especially since `Map<String, Object>` is
   extremely vague, given that everything in Java is an `Object`.
      1. `Handler` interface: This interface is implemented by all the handlers. As described above, it requires the handler to have a `serialize` method. This `serialize`
         method takes in a `Map` of {string:objects} (i.e. `Map<String, Object>`) and uses Moshi to serialize it to a JSON string that we can return to the
         user. This interface also requires classes to implement the `Handle` function (since it extends the `Route` interface).
      2. `CSVHandler`: This package contains the following 2 handlers:
         1. `LoadCSVHandler`: successful requests made to the `/loadcsv` endpoint include a valid filepath as a query parameter.
         The `handle` function extracts this filepath, loads it using the CSV parser, and stores it. We handle bad requests and
            bad filepaths here, meaning if the request is poorly formatted, fields are missing, or the filepath is inaccessible,
            we return a JSON string indicating that. Filepaths are inaccessible if the filepath doesn't exist or if the filepath
            does not begin with the current working directory that the server is running from i.e. the files in the project folder
            (this was implemented to heightened the security features that our API server offers).
            We return a success message if the CSV is successfully loaded.<br> NOTE: all the responses that are returned are serialized versions of `Map<String, Object>` objects.
         2. `GetCSVHandler`: the `handle` method of this handler checks if a CSV has been loaded previously, and returns it if it has been loaded. It also handles errors with bad requests.
            If the getcsv call is run successfully, we return a success message alongside the parsed CSV.
      3. `WeatherHandler`: This package contains a single handler (`WeatherHandler`), and some other classes that are used by `WeatherHandler`:
         1. `WeatherHandler`: successful requests to the `/weather` endpoint must include valid latitude and longitude values as query parameters.
         The `handle` function extracts these values, and then returns the temperature at that location if it
            is inside the US. It handles bad requests, meaning that if fields are missing, extra fields exist, or the latitude/longitude
            values are invalid, we return an error message. Once again, if the temperature is successfully found, we return a success
            message with the temperature, latitude, and longitude. <br>  This handler also has a method to extract a temperature (`extractTemperature`) from the
            NWS API. To do this, we set up the classes `ForecastPeriod`, `ForecastLink`, and `ForecastProperties`. We can deserialize the response of the NWS API
            into these classes, which enables us to grab the forecast link from the first request to the API call, and make a new request to this link (URL), and on
            deserializing this, we can extract all the forecast periods, and get the temperature from the first one (current temperature).
         2. `ForecastLink`: a class used to deserialize the response of the NWS API when we make our first request to it (we can access the link provided by the API
             in the "forecast" field of its response --> this link is a URL to which we can make a request to get the forecast data for our desired location).
         3. `ForecastProperties`, `ForecastPeriods`, `ForecastPeriod`: these are classes used to deserialize the data from the response from the second call to the NWS API --> 
             we deserialize the forecast data into these classes, and can then extract the temperature from the first forecast period.
      4. `InvalidEndpointHandler`: this handler exists to return "error_bad_json" as the "result", in the event that a request is made to an invalid endpoint
         (i.e. an endpoint that has not been defined for the API server).

## Integrating new datasources

If a developer wants to integrate a new datasource/endpoint into our API, the extensible design of the API makes this very easy.
The developer would have to start by designing a new handler. This handler would implement the `Handler` interface. They would have to
define the `handle` function of this handler (to get the query parameters, if any, and create the response). They would also have to implement
the `serialize` method in order to `serialize` their responses into JSON strings. If they wish to, they could create a new package in the `server` package in which to
place their new handler class (similar to how the `WeatherHandler` class is located in the `WeatherHandler` package).
<br> Now, to add this datasource to the API, the developer would just have to add a **single line of code**! They would just have to set up a new endpoint
in the `main` method of the `Server` class (this is a single line of code that needs to be added, and the location where it should be added is
also mentioned as in inline comment in the code of that method) and pass in an instance of the handler they designed as the handler for that endpoint).
<br> <br> We can look at an example of this. Say we wish to design a new datasource and endpoint: we want an endpoint called `/distance`, and we want to accept some `x` and `y` coordinates of 2 points,
and then compute the euclidean distance between those points.
Say we define our own handler in a class called `DistanceHandler`. Then, all we would have to do in `Server`, is add this single line of code in
the location that is pointed out (with an inline comment):
```
Spark.get("distance", new DistanceHandler());
```
Simply by doing this, the developer now has their own custom handler (for a custom new datasource) integrated with our API, with minimal code changes.
Additionally, since the handler they develop implements our `Handle` interface, they also get to see a blueprint of exactly what functionlity
they need to implement in order to have their new handler be compatible with our API server.


## Assumptions Made
1. When we parse the CSV data at the location in some valid filepath, we assume that the CSV data does _not_ have a header.
2. When we return the temperature when a request is made to the `/weather` endpoint, we only return the temperature from the _first_ period from
the forecast --> we only return the current temperature
3. Since the default unit in which the NWS API returns temperatures is Fahrenheit (and since we don't make requests while asking for different units), we
assume that the result is **always in Fahrenheit**. Due to this, we also don't display this unit in the response to the request made to the `/weather` endpoint.
4. If a request is made to an endpoint and more query parameters are passed in than are expected, then we consider this to be a bad request, and `"error_bad_request"`
is returned as the "result" of the response.


## Testing

We split our testing suite into two parts, unit testing and integration testing.

### Unit Testing
Firstly, unit testing is largely similar across our 3 handlers. We have GetCSVResponse, LoadCSVResponse, and WeatherResponse
test files. Each of them tests the success, failure, and serialize methods. We mocked (locally stored as Strings, not in separate files) the serialized JSON strings
(mock responses of our API server) and deserialized maps that we expected our handler to work with, and ensured that these values were accurate with a range of
inputs. The documentation for this testing goes into more detail above each of the individual tests.

Additionally, we also mocked responses from the NWS API (to aid in further unit testing for `WeatherHandler`). This mocked data is stored in `mockGridData.JSON` and `mockForecastData.JSON`. `mockGridData.JSON` is a mock response of what
would be returned by the NWS API when we make the intial request to it -- this response contains the "forecast" filed with the link (URL) to which we wish to make the second request to get the
temperature data. We run a unit test for our `extractForecastLink` method, to ensure that the forecast link we extracted was the same as the one in the mocked file.
`mockForecastData.JSON` is a mock file containing data that would be returned by the NWS API when we make our second request to it -- this JSON contains information on the forecast periods.
We test the `extractCurrentTemperature` using this data, to ensure that the current temperature is accurately extracted.

### Integration Testing
Integration tests for each of the handlers are located in a different file. However, since Spark only allows us to define a `port` in one test file, we don't run the tests in these separate files.
In these separate files, we define the test functions, but these are run with `@Test` annotations from a combined file: `TestIntegration` --> this file indirectly runs all the integration tests.

The integration tests are constructed in the following manner: In these tests, we make requests to the API server, and then deserialize the response into a
`Map<String, Object>`, and then compare the deserialized map against the expected map, to check if they are the same. If they are the same, then the test passes.

The actual functions used for the integration tests are distributed into different files corresponding to which handlers they test:
1. `TestGetCSVHandler`: integration tests for the handler for the `/getcsv` endpoint. Some of the situations we have tested here include:
   1. errors when a `/getcsv` request is made before a valid `/loadcsv` request
   2. errors when `/getcsv` requests are made with extra query parameters
   3. errors when a `/getcsv` request is made after an invalid `/loadcsv` request
   4. success when `/getcsv` requests are made after valid `/loadcsv` requests (incuding with an empty CSV -> edge case)
   5. success with `/getcsv` requests after each of two `/loadcsv` requests
   6. success with `/getcsv` request after two `/loadcsv` requests (second loaded CSV is returned)
2. `TestLoadCSVHandler`: integration tests for the handler for the `/loadcsv` endpoint. Some of the situations we have tested here include:
   1. errors when `/loadcsv` requests are made without the filepath query parameter
   2. errors when `/loadcsv` requests are made with extra query paramaters
   3. errors when `/loadcsv` requests are made with invalid filepaths
   4. success when `/loadcsv` requests are made with valid filepaths (including for the empty CSV -> edge case)
   5. success when two `/loadcsv` requests are made --> also ensure that the internal state of the latest loaded CSV is updated after both requests.
   6. errors when `/loadcsv` requests are made with CSV files outside the current project folder (due to self-imposed restriction access for safety purposes).
3. `TestWeatherHandler`: integration tests for the handler for the `/weather` endpoint. Some of the situations we have tested here include:
   1. errors when `/weather` requests are made with no query parameters
   2. errors when `/weather` requests are made without the longitude or latitude (or both)
   3. errors when `/weather` requests are made with extra query parameters
   4. success when `/weather` requests are made with valid latitude and longitude values
   5. errors when `/weather` requests are made with coordinates outside the USA
   6. errors when `/weather` requests are made with latitude and/or longitude values are outside the possible range (outside the range of values on which
   latitudes/langitudes are defined)
   7. errors when `/weather` requests are made with latitude and longitude values are of the incorrect type (ex: we pass random words (Strings) as the values for lat and lon in the request) 
4. `TestInvalidEndpointHandler`: integration tests for the handler for all invalid endpoints. Some of the situations we have tested here include:
   1. error when requests are made to an undefined endpoint
   2. error when requests are made to an undefined endpoint (even when the endpoint requested is a valid endpoint, but converted to uppercase) --> ensures
   that our API server is case-sensitive in checking for endpoints.

## Errors and Bugs
There are no real bugs with our code; the code appears to work correctly, and to the best of our knowledge, it satisfies all the user stories.

One thing we did note, however, was that the NWS API did appear slightly "buggy" in certain situations. Even with the same request made to the NWS API (through a webbrowser), while the NWS API would return
the successful response most fo the time, it would occasionally be unable to return a temperature value. Their API would simply return an "unexpected problem".
Due to this, while all of our integration tests pass most of the time, occassionally, 1-2 tests might fail since we expect a success response but our API server handles the failed response from the NWS API to return an "error_datasource"... 
this conflict causes the test to fail. Usually when this happens, simply running `mvn test` once again causes all the tests to pass
once again.

Essentially, we aren't sure why the NWS API behaves this way, but the program generally
works for values in the US. That being said, in the situations in which such a failed is returned by the NWS API server,
we gracefully catch those errors, and return `"error_datasource"` as the result of the request
made to our API (but this can cause the test to occassionally fail).

Since the same test passes most of the time and only fails very rarely (when the NWS API seems to fail), we have left these tests in our code,
since they provide important information. They tell us when the NWS API seems to be behaving unreliably --> i.e. it tells us when the datasource of our choice is not behaving in the manner
in which we expect it to.

## How to run the tests
All of the tests that have been written in this project can be run by entering the following command
into the terminal:
```
mvn test
```

## How to build and run the program
Initially, in order to compile the entire codebase, we need to run the following command in the terminal:
```
mvn package
```

Next, we need to run the main method in the `Server` class. Once this is done, and we can see an output message in the console
saying "Server started", we can start using our API server.

We can open a webbrowser and make API requests. The format in which valid API requests can be made to each of the 3 defined endpoints is:
1. `localhost:3232/loadcsv?filepath={some-filepath}`
2. `localhost:3232/getcsv`
3. `localhost:3232/weather?lat={latitude->decimal value}&lon={longitude->decimal value}`

When we make these requests to the API server in the browser, the response returned by teh API server can be seen in the browser.


## Explanation of some checkstyle warnings:
1. In the `handle` method of some of the handlers, there is a warning saying that the `throws Exception` annotation is not required, since exceptions are never thrown. However, this cannot
be removed since it is required in the signature of the `handle` method, as declared by the `Route` interface.
2. In the `serialize` method, we convert the `Map<String, Object>` object to a JSON string using Moshi's JsonAdapter: `JsonAdapter<Map> jsonAdapter = moshi.adapter(Map.class);`. We
get a warning saying that this is a raw use of a parameterized class (Map), however, the JsonAdapter doesn't exist a Parameterized version of the Map class as a type, so this warning must
be allowed to persist.
3. In the `ForecastLink`, `ForecastProperties`, `ForecastPeriods`, and `ForecastPeriod` classes, there is a warning that some of the fields are never initialized to a value. This is because
these values are initialized by Moshi while we are deserializing JSON data into objects of these classes (therefore, we don't need a constructor for this class). Thus, these warnings can be allowed
to persist.

  
## External References:
* [Reading JSON files as strings in Java](https://devqa.io/java-read-json-file-as-string/) (for mocking data)
