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
  
		  function add_entity(p_entity) {
			  if(hass.states[config.program].attributes[p_entity]) {
				  entities.push(hass.states[config.program].attributes[p_entity]);
			  }
		  }

		  function add_button(p_entity, p_zone) {

			entities.push({ 
						  type: 'conditional',
						  conditions: [{entity: p_entity, state: 'off'}],
						  row: 
						    {
							type: 'button',
							name: p_zone,
							icon: 'mdi:power',
							action_name: 'Run Zone',
							tap_action: 
							  {
							  action: 'call-service',
							  service: 'irrigationprogram.run_zone',
							  service_data: 
							    {
							    entity_id: p_entity,
							    zone: p_zone
								}
							  }
							}
						  });
		  }

  
		  function add_conditional_entity(p_conditions, p_entity) {
			  if(hass.states[config.program].attributes[p_entity]) {
				  entities.push({ type: 'conditional',
								  conditions: p_conditions,
								  row: {entity: hass.states[config.program].attributes[p_entity]}
							  });
			  }
		  }
  
		  function add_conditional_attribute(p_conditions, p_attribute, p_name, p_icon) {
			  if(hass.states[config.program].attributes[p_attribute]) {
				  entities.push({ type: 'conditional',
								  conditions: p_conditions,
								  row: {type: 'attribute',
									  entity: config.program,
									  attribute: p_attribute,
									  name: p_name,
									  icon: p_icon }
							  });
			  }	
		  }
  
		  function add_attribute(p_attribute, p_name, p_icon) {
			  entities.push({ type: 'attribute',
							  entity: config.program,
							  attribute: p_attribute,
							  name: p_name,
							  icon: p_icon });
		  }
  
		  entities.push(program);
		  
		  add_conditional_entity([{entity: config.program, state: 'off'}], 'start_time')
		  add_conditional_attribute([{entity: config.program, state: 'on'}], 'remaining', 'Remaining', 'mdi:timer-outline');
  
		  add_entity('irrigation_on');
		  add_entity('run_freq');
		  add_entity('controller_monitor');
  
  
		  let zones = Number(hass.states[config.program].attributes['zone_count'])
  
		  for (let i = 1; i < zones + 1; i++) {
  
			  let n = 1;
  
			  entities.push({ type: 'section',
							  label: hass.states[config.program].attributes['zone' + String(i) + '_name']
						  });
  
			  add_conditional_attribute([{entity: config.program, state: 'on'}], 'zone' + String(i) + '_remaining', 'Remaining', 'mdi:timer-outline');
			  add_conditional_attribute([{entity: config.program, state: 'off'}], 'zone' + String(i) + '_last_ran', 'Last Ran', 'mdi:clock');

			  add_button(program,
						hass.states[config.program].attributes['zone' + String(i) + '_name'], 
						);
  
			  
			  add_entity('zone' + String(i) + '_run_freq');
			  add_entity('zone' + String(i) + '_disable_zone');
			  add_entity('zone' + String(i) + '_water');
			  add_entity('zone' + String(i) + '_water_adjustment');
			  add_entity('zone' + String(i) + '_wait');
			  add_entity('zone' + String(i) + '_repeat');
			  add_entity('zone' + String(i) + '_rain_sensor');
			  add_entity('zone' + String(i) + '_ignore_rain_sensor');
  
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