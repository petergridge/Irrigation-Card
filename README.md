# Custom Card for Irrigation Component V4 <img src="https://github.com/petergridge/irrigation_card/blob/main/icon.png" alt="drawing" width="75"/>

This card works with [Irrigation Component](https://github.com/petergridge/irrigation_component_v4) and provides an interface reflecting the configuration of the irrigation custom component.

## Installation
HACS installation
* Will be available on HACS soon but you can add it a custom repository.

Manual install
* Ensure you have advanced mode enabled in Home Assistant
* Copy irrigation-card.js to the /config/www directory in Home Assistant
* In the *configuration/LoveLace* dashboards page select the *Resources* tab
* Add the resource */local/irrigation-card.js?v=1* increment the version number if updating an exsting installation
* Add a manual card with the definition below

## Configuration

**type:** (required) custom:irrigation-card

**program:** (required) The switch representation of the irrigation program

**title:** (optional) The title to be set in the card. defaults to the program freindly name

**header:** (optional) Header widget to render an image. See [header/footer documentation](https://www.home-assistant.io/lovelace/header-footer/).

**footer:** (optional) Header widget to render and image. See [header/footer documentation](https://www.home-assistant.io/lovelace/header-footer/).

**Example:**
```yaml
type: custom:irrigation-card
program: switch.afternoon
title: Afternoon Program
```

## REVISION HISTORY
### 1.0.7
* Add header and footer capability
### 1.0.6
* Add run zone functionality
### 1.0.5
* Improve code 
* add conditonal display of remainin time/last ran
### 1.0.4
* Add zone level remaining run time
### 1.0.3
* Register card so it appears on the list of cards
### 1.0.2
* Fixed missing config objects
### 1.0.1
* Updated error handling. More robust when incorrect object defined
### 1.0.0
* New repository
