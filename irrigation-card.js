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
	  //https://www.home-assistant.io/lovelace/header-footer/
	  config.card.header = config.header;
	  config.card.footer = config.footer;
	  config.card.icon = config.icon;
	  config.card.theme = config.theme;
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

			function slugify(str)
			{
				str = str.toLowerCase();
				str = str.replace(/[^a-z0-9_.]/g, ' '); // remove unexpected
				str = str.replace(/^\s+|\s+$/g, ''); // trim
   		  str = str.replace(/\s+/g, '_'); 
        return str;
			}

			function sentencecase(str)
			{
				str = str.charAt(0).toUpperCase() + str.slice(1);
				var from = "_";
				var to   = " ";
				for (var i=0, l=from.length ; i<l ; i++) {
						str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
				}
				return str;
			}


		  function add_entity(p_entity) {
			  if(hass.states[config.program].attributes[p_entity]) {
				  entities.push(hass.states[config.program].attributes[p_entity]);
			  }
		  }
		  function add_known_entity(p_entity) {
				let a = slugify(p_entity)
//				let a = p_entity
			  if(hass.states[a]) {
				  entities.push(a);
				}
		  }

		  function add_button_service(p_service, p_name, p_action_name, p_data, p_conditions) {
			entities.push({
						  type: 'conditional',
						  conditions: p_conditions,
						  row:
						    {
							type: 'button',
							name: p_name,
							icon: 'mdi:power',
							action_name: p_action_name,
							tap_action:
							  {
							  action: 'call-service',
							  service: p_service,
							  service_data:
							    p_data
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
		  function add_known_conditional_entity(p_conditions, p_entity) {
        let a = slugify(p_entity)
//        let a = p_entity
			  if(hass.states[a]) {
					if (hass.states[a].state != 'unavailable') {
						entities.push({ type: 'conditional',
										conditions: p_conditions,
										row: {entity: a}
									});
					}
				}
		  }

		  function add_attribute(p_attribute, p_name, p_icon, p_conditions) {
			  if(hass.states[config.program].attributes[p_attribute]) {
          if(p_conditions == null) {
    			  entities.push({ type: 'attribute',
					  entity: config.program,
					  attribute: p_attribute,
					  name: p_name,
					  icon: p_icon });
			    } else {
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
		  }

			config.card.title = hass.states[config.program].attributes['friendly_name'];

			let friendly_name = slugify(hass.states[config.program].attributes['friendly_name'])
			let name = config.program.split(".")[1]
			let show_config = 'input_boolean.' + name + '_show_config'
			if(hass.states[config.program].attributes['controller_monitor']) {
				entities.push({ type: 'conditional',
								conditions: [{entity: hass.states[config.program].attributes['controller_monitor'], state: 'off'}],
								row: {type: 'section',
											label: "Off-line!"}
								});

				add_button_service(
					'switch.turn_on',
					hass.states[config.program].attributes['friendly_name'],
					'Run Program',
					{
					entity_id: program,
					},
					[{entity: program, state: 'off'},
					 {entity: 'input_boolean.' +name+'_irrigation_on', state: 'on'},
					 {entity: hass.states[config.program].attributes['controller_monitor'], state: 'on'}
					 ]);
			} else {
				add_button_service(
					'switch.turn_on',
					hass.states[config.program].attributes['friendly_name'],
					'Run Program',
					{
					entity_id: program,
					},
					[{entity: program, state: 'off'},
					 {entity: 'input_boolean.' + name + '_irrigation_on', state: 'on'}
					]);
			}				
	
		  add_button_service(
			'switch.turn_off',
			hass.states[config.program].attributes['friendly_name'],
			'Stop Program',
			{
			entity_id: program,
			},
			[{entity: program, state: 'on'}]);

//add_attribute('remaining', 'Remaining', 'mdi:timer-outline', [{entity: config.program, state: 'on'}]);
			add_known_entity(show_config);

			add_known_conditional_entity([{entity: show_config, state: 'on'}],'input_datetime.'+name+'_start_time');
			add_known_conditional_entity([{entity: show_config, state: 'on'}],'input_boolean.' +name+'_irrigation_on');
			add_conditional_entity([{entity: show_config, state: 'on'}],'run_freq');
			add_conditional_entity([{entity: show_config, state: 'on'}],'controller_monitor');
			add_known_conditional_entity([{entity: show_config, state: 'on'}],'input_number.'+name+'_inter_zone_delay');


				entities.push({ type: 'conditional',
								conditions: [{entity: show_config, state: 'on'}],
								row: {type: 'section',
											label: 'Zones'}
							  });


		  let zones = Number(hass.states[config.program].attributes['zone_count'])

		  for (let i = 1; i < zones + 1; i++) {

			  let n = 1;
				let zname = hass.states[config.program].attributes['zone' + String(i) + '_name'];
				let zpath = slugify(name + '_' + zname)
				let iboolean = 'input_boolean.' + zpath;
				let itext    = 'input_text.'    + zpath;
				let inumber  = 'input_number.'  + zpath;

				if(hass.states[config.program].attributes['controller_monitor']) {
					entities.push({ type: 'conditional',
									conditions: [{entity: show_config, state: 'on'},
															 {entity: iboolean + '_enable_zone', state: 'on'},
															 {entity: hass.states[config.program].attributes['controller_monitor'], state: 'on'}],
									row: {type: 'section',
												label: ''}
									});
					entities.push({ type: 'conditional',
									conditions: [{entity: hass.states[config.program].attributes['controller_monitor'], state: 'off'}],
									row: {type: 'section',
												label: sentencecase(zname)}
									});
					entities.push({ type: 'conditional',
									conditions: [{entity: iboolean + '_enable_zone', state: 'off'},
															 {entity: hass.states[config.program].attributes['controller_monitor'], state: 'on'}],
									row: {type: 'section',
												label: sentencecase(zname)}
									});
					add_button_service(
						'irrigationprogram.run_zone',
						sentencecase(zname),
						'Run Zone',
						{
						entity_id: program,
						zone: zname,
						},
						[{entity: program, state: 'off'},
						 {entity: iboolean + '_enable_zone', state: 'on'},
						 {entity: iboolean +'_irrigation_on', state: 'on'},
						 {entity: hass.states[config.program].attributes['controller_monitor'], state: 'on'}]);
				 } else {
					entities.push({ type: 'conditional',
									conditions: [{entity: show_config, state: 'on'},
															 {entity: iboolean + '_enable_zone', state: 'on'}],
									row: {type: 'section',
												label: ''}
									});
					entities.push({ type: 'conditional',
									conditions: [{entity: iboolean + '_enable_zone', state: 'off'}],
									row: {type: 'section',
												label: sentencecase(zname)}
									});
					add_button_service(
						'irrigationprogram.run_zone',
						sentencecase(zname),
						'Run Zone',
						{
						entity_id: program,
						zone: zname,
						},
						[{entity: program, state: 'off'},
						 {entity: iboolean + '_enable_zone', state: 'on'},
						 {entity: 'input_boolean.' +name+'_irrigation_on', state: 'on'}]);
				}	
				
				
				


			  add_attribute(zpath + '_remaining', 
											sentencecase(zname), 'mdi:timer-outline', 
											[{entity: config.program, state: 'on'},{entity: iboolean + '_enable_zone', state: 'on'}]
											);
				
				add_known_conditional_entity([{entity: show_config, state: 'on'}],iboolean + '_enable_zone');
				add_conditional_entity([{entity: show_config, state: 'on'}],zpath + '_run_freq');
				add_known_conditional_entity([{entity: show_config, state: 'on'}],itext + '_zone_group');
				add_known_conditional_entity([{entity: show_config, state: 'on'}],inumber + '_water');
				add_known_conditional_entity([{entity: show_config, state: 'on'}],inumber + '_wait');
				add_known_conditional_entity([{entity: show_config, state: 'on'}],inumber + '_repeat');
				add_conditional_entity([{entity: show_config, state: 'on'}],zpath + '_rain_sensor');
				add_known_conditional_entity([{entity: show_config, state: 'on'}],iboolean + '_ignore_rain_sensor');
				add_conditional_entity([{entity: show_config, state: 'on'}],zpath + '_water_adjustment');
				add_conditional_entity([{entity: show_config, state: 'on'}],zpath + '_flow_sensor');
				add_attribute( zpath + '_last_ran' , 'Last Ran' , 'mdi:clock', [{entity: show_config, state: 'on'}]);

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