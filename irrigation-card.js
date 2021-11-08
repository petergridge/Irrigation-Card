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
	const monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];

    const config = this._config;
    if (!hass.states[config.program]) {
      throw new Error(`${config.program} not found`);
    }

    if (config.title) {
		config.card.title = config.title;
	}
	else
	{
      config.card.title = hass.states[config.program].attributes['friendly_name'];
    }
	config.card.show_header_toggle = false;
	config.card.state_color = true;

    let entities = [config.program];
	
	entities.push(hass.states[config.program].attributes['start_time']);
	
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
		
		let rundate = new Date(hass.states[config.program].attributes['zone' + String(i) + '_last_ran']);
		let outputdate = monthNames[rundate.getMonth()]
						+ ' ' 
						+ rundate.getDate() 
						+ ', ' 
						+ rundate.getYear()
						+ ', ' 
						+ rundate.getHours() + ':' + rundate.getMinutes();	

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
		if(hass.states[config.program].attributes['zone' + String(i) + '_ignore_rain_bool']) {
			entities.push(hass.states[config.program].attributes['zone' + String(i) + '_ignore_rain_sensor']);
		}
		if(hass.states[config.program].attributes['zone' + String(i) + '_run_freq']) {
			entities.push(hass.states[config.program].attributes['zone' + String(i) + '_run_freq']);
		} 
	}

	config.card.entities = entities;
	this.lastChild.setConfig(config.card);
	this.lastChild.hass = hass;

  }

  getCardSize() {
    return 'getCardSize' in this.lastChild ? this.lastChild.getCardSize() : 1;
  }
}

customElements.define('irrigation-card', IrrigationCard);