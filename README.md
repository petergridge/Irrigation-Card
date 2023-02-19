[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?logo=homeassistantcommunitystore)](https://github.com/hacs/integration) [![my_badge](https://img.shields.io/badge/Home%20Assistant-Community-41BDF5.svg?logo=homeassistant)](https://community.home-assistant.io/t/irrigation-custom-component-with-custom-card/124370)

![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/petergridge/Irrigation-Card/hacs-validate.yml?branch=main&label=HACS)
![GitHub release (latest by date)](https://img.shields.io/github/downloads/petergridge/Irrigation-Card/latest/total)

# Custom Card for Irrigation Component <img src="https://github.com/petergridge/irrigation-card/blob/main/icon.png" alt="drawing" width="30"/>

This card works with [Irrigation Component](https://github.com/petergridge/Irrigation-V5) and provides an interface reflecting the configuration of the irrigation custom component. Kudos to the HA team, the card leverages the capabilities of the default entities card.

![image](https://user-images.githubusercontent.com/40281772/215010935-27f2afd4-db2c-43c5-b9ca-2ebb7f9a8db8.png)

## Installation
HACS installation
* Adding the repository using HACS is the simplest approach

NOTE: If you are migrating from a manual installation:
  * unregister the resource /local/irrigation_card.js
  * delete irrigation_card.js from config/www

Manual install
* Ensure you have advanced mode enabled in Home Assistant
* Copy irrigation-card.js to the /config/www directory in Home Assistant
* In the *configuration/LoveLace* dashboards page select the *Resources* tab
* Add the resource */local/irrigation-card.js?v=1* increment the version number if updating an exsting installation

Edit your dashboard

Add the custom card

![image](https://user-images.githubusercontent.com/40281772/204683211-cb589ccd-0183-4b50-9b03-0d6e3ea7795e.png)


## Configuration

**type:** (required) custom:irrigation-card

**program:** (required) The switch representation of the irrigation program

**entities:** (optional) The list of entities to show on this card. If not provided all entities are displayed. This supports multiple cards being used for a single program

**show_program:** (optional) False will result in the program information being omitted from the card

**title:** (optional) The title to be set in the card.

**icon:** (optional) An icon to display to the left of the title.

**theme:** (optional) Override the used theme for this card with any loaded theme. For more information about themes, see the [frontend documentation](https://www.home-assistant.io/integrations/frontend/).

**header:** (optional) Header widget to render an image. See [header/footer documentation](https://www.home-assistant.io/lovelace/header-footer/).

**footer:** (optional) Header widget to render an image. See [header/footer documentation](https://www.home-assistant.io/lovelace/header-footer/).

**Example:**
```yaml
type: custom:irrigation-card
title: Afternoon Program
program: switch.afternoon
show_program: false
entities:
  - switch.zone1
  - switch.zone2
```
**Card-Mod**

Support for https://github.com/thomasloven/lovelace-card-mod.
Allows you to apply CSS styles to various elements of the Home Assistant frontend.
```
card_mod:
  style: |
    ha-card {
      background-image: url('/local/lawn.png'); 
      background-repeat: no-repeat;
      color: red;
      --paper-item-icon-color: red;
      --mdc-theme-primary: black;
    }
```
These are some examples, use F12 on Chrome to discover other style options. My explanation of the action are not definitive the style change can affect other components as well. There are many more stype options available that will have an impact. Please share exampless and action for me to update this list.
 
|example     |action   |
|:---        |:---     |
|background-image: url('/local/lawn.png');|to set a background image|
|background-repeat: no-repeat; |to prevent the image repeating to fill the card|
|color: red; |set the general text colour|
|--state-active-color: blue;| change the colour of the input_boolean icon 'on' state|
|--state-switch-active-color: blue;|change the colour of switch entity icons |
|--paper-item-icon-color: red; |set the icon inactive 'off' state colour|
|--mdc-theme-primary: black; |set the colour of the program run/stop text|
|--paper-slider-active-color: red; |change the slider colour left of the knob|
|--paper-slider-knob-color: red;| knob colour when the slider is not at the minimum value|
|--paper-slider-knob-start-color: red;|Knob colour when the slider is at the minimum value|
|--paper-slider-pin-color: red;|colour of the slider value callout|
|--paper-slider-pin-start-color: red;|colour of the slider value callout when at the minimum value|
|--paper-slider-container-color: red;|colour of the line to the right of the knob|



## REVISION HISTORY
### 5.2.0
* Grouped zones as a single zone, if all helper entities are identical
* Limit zones on card so multiple cards can be used to display a program
* Allow program data to be excluded so multiple cards can be used to display a program
* Provide relative time since the zone last ran
* Provide program level runtime
* Stopping a running zone will now only stop that zone, the program will continue
* Support Card Mod addon allowing custom backgroud and other style modifications.
### 5.1.16
* Reduce english content
* correct friendly name usage
### 5.1.15
* Initial HACS release
* Sync version with Irrigation-V5
### 5.0.0
* Refactored to work with Irrigation component V5
* is not compatible with Irrigation component V4 use v1.0.11.
### 1.0.11
* Enable Zone functionality. Prerequisite is V4.0.11 of Irrigation Component V4 to support the 
### 1.0.8
* Add ability to hide/show configuration. Prerequisite is V4.0.8 of Irrigation Component V4 to support the 
### 1.0.7
* Add header and footer capability
### 1.0.6
* Add run zone functionality
### 1.0.5
* Improve code 
* add conditonal display of remaining time/last ran
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
