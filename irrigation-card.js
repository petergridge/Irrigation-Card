
class IrrigationCard extends HTMLElement {
  
  setConfig(config) {
    if (!config.program) {
      throw new Error('Please specify an irrigation program');
    }

    if (this.lastChild) this.removeChild(this.lastChild);
    const cardConfig = Object.assign({}, config);
    if (!cardConfig.card) cardConfig.card = {};
    if (!cardConfig.card.type) cardConfig.card.type = 'entities';
    if (!cardConfig.entities_vars) cardConfig.entities_vars = { type: 'entity' };
    const element = document.createElement(`hui-${cardConfig.card.type}-card`);
    this.appendChild(element);
    this._config = JSON.parse(JSON.stringify(cardConfig));
  }

  set hass(hass) {
    const config = this._config;
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"];

	config.card.title = config.title;
	config.card.show_header_toggle = false;
	config.card.state_color = true;
	let defentities = [];
	let validconfig = 'invalid';

	const x = hass.states[config.program];
	if (!x) {
		config.card.title = 'ERR';
		validconfig == 'invalid'
		defentities.push({ 
						type: 'section', 
						label: 'Program: not found'
						});
		config.card.title = 'ERROR: ' + config.program;
	} else {
		validconfig = 'valid';
    } 

	if (validconfig === 'valid') {
		if (!hass.states[config.program].attributes['zone_count']) {
			defentities.push({ 
							type: 'section', 
							label: 'Program: not v4 or newer irriation component'
							});
			config.card.title = 'ERROR: ' + config.program;
			validconfig = 'invalid';
		}
	}
	
	function cardentities(hass, program) {
		let entities = []
		entities.push(program);
		entities.push(hass.states[program].attributes['start_time']);
		if(hass.states[config.program].attributes['irrigation_on']) {
			entities.push(hass.states[config.program].attributes['irrigation_on']);
		}
		if(hass.states[config.program].attributes['run_freq']) {
			entities.push(hass.states[config.program].attributes['run_freq']);
		}
		if(hass.states[config.program].attributes['controller_monitor']) {
			entities.push(hass.states[config.program].attributes['controller_monitor']);
		}

		entities.push({ type: 'conditional', 
						conditions: [{entity: config.program, state: 'on'}],
						row: {type: 'attribute', 
							entity: config.program, 
							attribute: 'remaining', 
							name: 'Remaining', 
							icon: 'mdi:timer-outline' } 
					});

		let zones = Number(hass.states[config.program].attributes['zone_count'])

		for (let i = 1; i < zones + 1; i++) {

			let n = 1;

			entities.push({ type: 'section', 
							label: hass.states[config.program].attributes['zone' + String(i) + '_name'] 
						});

			entities.push({ type: 'attribute',
							entity: config.program, 
							attribute: 'zone' + String(i) + '_last_ran', 
							name: 'Last Ran', icon: 'mdi:clock' });

			if(hass.states[config.program].attributes['zone' + String(i) + '_water']) {
				entities.push(hass.states[config.program].attributes['zone' + String(i) + '_water']);
			}
			if(hass.states[config.program].attributes['zone' + String(i) + '_water_adjustment']) {
				entities.push(hass.states[config.program].attributes['zone' + String(i) + '_water_adjustment']);
			}
			if(hass.states[config.program].attributes['zone' + String(i) + '_wait']) {
				entities.push(hass.states[config.program].attributes['zone' + String(i) + '_wait']);
			}
			if(hass.states[config.program].attributes['zone' + String(i) + '_repeat']) {
				entities.push(hass.states[config.program].attributes['zone' + String(i) + '_repeat']);
			}
			if(hass.states[config.program].attributes['zone' + String(i) + '_rain_sensor']) {
				entities.push(hass.states[config.program].attributes['zone' + String(i) + '_rain_sensor']);
			}
			if(hass.states[config.program].attributes['zone' + String(i) + '_ignore_rain_sensor']) {
				entities.push(hass.states[config.program].attributes['zone' + String(i) + '_ignore_rain_sensor']);
			}
			if(hass.states[config.program].attributes['zone' + String(i) + '_run_freq']) {
				entities.push(hass.states[config.program].attributes['zone' + String(i) + '_run_freq']);
			} 
		}
		return entities;
	}
	
	if (validconfig === 'valid') {
		config.card.entities = cardentities(hass, config.program);
	}
	else {
		config.card.entities = defentities;
	}

	this.lastChild.setConfig(config.card);
	this.lastChild.hass = hass;

  }

  getCardSize() {
    return 'getCardSize' in this.lastChild ? this.lastChild.getCardSize() : 1;
  }
}

customElements.define('irrigation-card', IrrigationCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "irrigation-card",
  name: "Irrigation Card",
  preview: true, // Optional - defaults to false
  description: "Custom card companion to Irrigation Custom COmponent" // Optional
});