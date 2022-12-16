# Slither+

**README for term-project-kkashyap-mpan11-nharbiso-plestz**. Within this document, the following is contained:

1. Project Details

2. Project Structure, Design, and Implementation Walkthrough

3. Errors & Bugs

4. Test Suite Summary

5. 'How To Get Started' Guide

# Project Details

  

## Project Description

  

### CSCI0320 Term Project: *Slither+*

At a basic level, this full-stack project is made up of a backend (Java) server combined with a frontend (TypeScript/React) client, which in coalition allow for full functionality of the Slither+ game.

***Repository Link***: [https://github.com/cs0320-f2022/term-project-kkashyap-mpan11-nharbiso-plestz](https://github.com/cs0320-f2022/term-project-kkashyap-mpan11-nharbiso-plestz)

Total Estimated Completion Time: 300 Hours

## Team Members & Contributions

This project had four contributors: Karan Kashyap (**`kkashyap`**), Mason Pan (**`mpan11`**), Nathan Harbison (**`nharbiso`**), and Paul Lestz (**`plestz`**).

# Structure, Design and Implementation Walkthrough

Within this section will be the summary, explanations, and justifications for the design and implementation of the React and Java files (*designed and edited by us for this project exclusively*) within this project.

.

# Errors & Bugs


# Test Suite Summary


# How To Get Started

## User Guide

To utilize the project, first run the server in the backend. This can be done by running the `SlitherServer` class through the `server` directory. Then, navigate to the frontend, specifically the `client` directory, and type `npm start` in the terminal. *Note: If the client-side packages/libraries have not been installed before, type `npm i` in the frontend directory ***before*** `npm start`.* This should bring up the main menu of the game in your respective browser.

## Accessibility Guide



## Running Tests

Tests may be run in two 'traditional' ways:

1. In the terminal, navigate to the backend directory, and then utilizing [Maven](https://maven.apache.org/) run the command `mvn test`. This will run all tests in this project and demonstrate how, in this version, they all pass.

2. In the file directory, open any given testing class. Then, run that file to run only tests within that class. In IntelliJ, this is done with a green play button. In VSCode, this can be done with `npm test`, which can be accessed after running `npm i` in the `frontend` directory.
