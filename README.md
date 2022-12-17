
# Slither+

**README for term-project-kkashyap-mpan11-nharbiso-plestz**. Within this document, the following is contained:

1. Project Overview

2. Project Details: Structure, Design, and Implementation Walkthrough

3. Errors & Bugs

4. Test Suite Summary

5. 'How To Get Started' Guide

# Project Overview

This project is a modified recreation of the hit video game [slither.io](http://slither.io/). Among notable features contained in this version that the original game lacks is the ability to play with friends in custom game lobbies via unique *game codes*.

## CSCI0320 Term Project: *Slither+*

At a basic level, this full-stack project is made up of a backend (Java) server combined with a frontend (TypeScript/React) client, which in coalition allow for full functionality of the Slither+ game.

***Repository Link***: [https://github.com/cs0320-f2022/term-project-kkashyap-mpan11-nharbiso-plestz](https://github.com/cs0320-f2022/term-project-kkashyap-mpan11-nharbiso-plestz)

Total Estimated Completion Time: 300 Hours

## Team Members & Contributions

This project had four contributors: Karan Kashyap (**`kkashyap`**), Mason Pan (**`mpan11`**), Nathan Harbison (**`nharbiso`**), and Paul Lestz (**`plestz`**).

# Project Details: Structure, Design and Implementation

Within this section will be the summary, explanations, and justifications for the design and implementation of the React and Java files (*designed and edited by us for this project exclusively*) within this project.

## Backend (Server)

### WIP

## Frontend (Client)

### WIP

## Accessibility Limitations & Features

The actual playability of Slither+ relies on two abilities: the ability to see and the ability to engage with a keyboard and mouse. If one is able to do both of these games, they should be able to reasonably engage with the UI of Slither+.

Unfortunately, given the fast-paced nature of Slither+ and the necessity of real-time visual information in informing one’s gameplay, a screen reader would not be able to accurately provide a visually impaired player with information quick enough to feasibly allow for them to play the game.

Additionally, given that the snake is operated by movements of a mouse by a player, it is imperative that a user is able to operate a mouse in order to enable playability of the game.

Note, accessibility features are enabled on text-based pages (e.g. the home screen and the instructions pop-up) via the use of `aria-label` and `aria-roledescription` tags. There is potential for use of a magnifier or screen-reader on such pages. However, the playability of the rest of the game is *dependent* on more than these text-based pages are, as described above. 

# Errors & Bugs

In the current version, there are no known errors or bugs present in Slither+.

# Test Suite Summary

Within the `server/src/test` directory, there are `.java` (Java) files containing tests for various aspects of the project. Sample features tested include those surrounding orbs and game codes.

Within the `client` directory, there are also `test.tsx` (TypeScript) files containing tests for their corresponding `.tsx` files.

Below can be found a summary of each test file's contents. More detailed information on each individual test can be found with the files' documentations themselves.

## Server (Backend) Tests

Contained within this section are notes on each of the backend files that have been tested thus far.

### OrbTest.java

Contains tests to confirm that all methods function properly in the `Orb` class. Among the notable items tested would be that Orb equality and hashes depend solely on an Orb's Position when producing values.

### OrbGeneratorTest.java

Contains tests to confirm that all methods function properly in the `OrbGenerator` class. Among the notable items tested was the functionality of the `generateOrbs` function (with varying levels of existing orbs, and with and without death orbs).

### OrbColorTest.java

Contains tests to confirm that orbs can properly display pseudo-randomly generated colors (from a list of potential options). 

### GameCodeGeneratorTest.java

Contains tests to confirm that all methods function properly in the `GameCodeGenerator` class. Among the notable items tested were the functionality of the `generateGameCode` function (with empty/non-empty sets of existing game codes), as well as that game codes contain the proper (i.e. capital letter) characters. The latter of these was completed using fuzz testing.

## Client (Frontend) Tests

Contained within this section are notes on each of the frontend files that have been tested thus far.

--TESTS IN DEVELOPMENT--

## Notes on Further Testing

The tests included in the current version of this project do not demonstrate a full and expansive suite of all possibility items to be tested. This is due primarily due to the time constraint on this project. A tradeoff had to be made between testing features and developing features, with the latter being the typical choice.

Despite this, some features that would have been tested with more time include:
- SlitherServer & WebSocket functionality (server)
- GameState functionality (server)
- Leaderboard Functionality (server)
- Exceptions (server)
- TBD (client)
- TBD (client)
- TBD (client)
- TBD (client)

# How To Get Started

## User Guide

To utilize the project (i.e. play the game properly), first run the server in the backend. This can be done by running the `SlitherServer` class through the `server` directory. Then, navigate to the frontend, specifically the `client` directory, and type `npm start` in the terminal. *Note: If the client-side packages/libraries have not been installed before, type `npm i` in the frontend directory ***before*** `npm start`.* 

This should bring up the main menu of the game in your respective browser. From here, enter a username and either create a game or join an existing one with a game code.

## Accessibility Guide

After loading the web page using the User Guide just above, one is able to use the site's *Accessibility Features* if desired.

*Note*: This project's accessibility features were tested using MacOS's built-in VoiceOver screenreader (which can be found in System Preferences --> Accessibility).

With VoiceOver enabled and the site loaded, it is recommended that one uses the 'Quick Nav' feature, which can be enabled by pressing the left and right arrow keys at the same time.

While in the site, Quick Nav allows for quick cycling through the command history and input area using the (left and right) arrow keys.

Quick Nav can be disabled by tapping the left and right arrow keys simultaneously again.

## Running Tests

Tests may be run in two 'traditional' ways:

1. In the terminal, navigate to the backend directory, and then utilizing [Maven](https://maven.apache.org/) run the command `mvn test`. This will run all tests in this project and demonstrate how, in this version, they all pass.

2. In the file directory, open any given testing class. Then, run that file to run only tests within that class. In IntelliJ, this is done with a green play button. In VSCode, this can be done with `npm test`, which can be accessed after running `npm i` in the `frontend` directory.
