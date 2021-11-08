# Irrigation Custom Card for Irrigation Component V4

This card works with https://github.com/petergridge/irrigation_component_v4 and provides an interface reflecting the configuration of the irrigation custom component.

## Installation
* Ensure you have advanced mode enabled in Home Assistant
* Copy irrigation-card.js to the /config/www directory in Home Assistant
* In the *configuration/LoveLace* dashboards page select the *Resources* tab
* add the resource */local/irrigation-card.js*

## Configuration
Add a manual card and use configuration.

**type:** custom:irrigation-card
**program:** The switch representation of the irrigation program 
**title:** The title to be set in the card. defaults to the program freindly name

**Example:**
```yaml
type: custom:irrigation-card
program: switch.afternoon
title: Afternoon Program
```

## REVISION HISTORY
### 1.0.0
* New repository
