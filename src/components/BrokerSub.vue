<template>
	<span></span>
</template>
<script>
	export default {
		name: 'BrokerSub',
		mounted() {
			/*SUBSCRIPTIONS*/

			//subscribe to version topic to get call back when broker
			//connects
			this.$mqtt.subscribe('$SYS/broker/version')
			//subscribe to command channel
			this.$mqtt.subscribe('codac/das/diag/msx/config/command')
			//subscribe to switchboard topics
			this.$mqtt.subscribe('codac/das/diag/msx/cstate/board/#')
			//subscribe to oven state topics
			this.$mqtt.subscribe('codac/das/diag/msx/cstate/ovens/#')
			//subscribe to diagostic statuses for each diagnostic system
			this.$mqtt.subscribe('codac/das/diag/+/state')
			//subscribe to oven config topics
			this.$mqtt.subscribe('codac/das/diag/msx/config/ovens/#')
			//subscribe to voltage values
			this.$mqtt.subscribe('codac/das/diag/msx/cstate/volts/#')
			//subscribe to detector-HVsource connections
			this.$mqtt.subscribe('codac/das/diag/msx/config/volts/+/+/detector')
			
			
			/*CALLBACK FOR BROKER DISCONNECT*/

			let self = this
			this.$mqtt._events.close.push(function(){
				console.log("disconnected to broker")
				self.$store.dispatch('setConnected', false)
			})
		},
		mqtt: {
			'$SYS/broker/version' () {
				//Detects when GUI connected to broker
				//When connecting to MQTT broker, client
				//receives message from $SYS
				//
				//When this message received, wait 500ms then
				//change connect status
				//
				//Gives the subscriptions time to trigure before displaying
				//The switchboard grid
				let self = this
				setTimeout(function(){
					console.log("connected to broker --")
					self.$store.dispatch('setConnected', true)
				}, 500)
			},
			'codac/das/diag/msx/cstate/board/#' (data, topic){
				/*SET NAME OF fiberType AT SWITCHBOARD POSITION*/
				let subTopics = topic.split("/")
				
				let col = subTopics[subTopics.length - 2]
				let row = subTopics[subTopics.length - 1]

				col = parseInt(col.slice(3, 5)) - 1
				row = parseInt(row.slice(3, 5)) - 1

				let value = JSON.parse(String(data)).value

				this.$store.dispatch('setfiberName', {x:col, y:row, value})

				/*SET fiberType CATEGORY (PMT/ PY/ N/A) AT SWITCHBOARD POSITION*/
				let fiberType = ''

				if(value.includes('PMT')){
					fiberType = 'PMT'
				} else if(value.includes('PY')){
					fiberType = 'PY'
				} else {
					fiberType = 'n/a'
				}
				this.$store.dispatch('setfiberType', {x:col, y:row, value:fiberType})
			},
			'codac/das/diag/msx/cstate/volts/#' (data, topic) {
				let topicStructure = topic.split("/")
				let HVSource = topicStructure[topicStructure.length - 2]
				let property = topicStructure[topicStructure.length - 1]
				
				let index =  HVSource + ":" +property[property.length - 1]
				let value = JSON.parse(String(data)).value
				this.$store.dispatch('setFeedValue', {index, value})
			},
			'codac/das/diag/msx/cstate/ovens/#' (data, topic) {
				let subTopics = topic.split("/")

				let property = subTopics[subTopics.length - 1]
				let fiberType = subTopics[subTopics.length - 2]
				
				if(fiberType.includes("PY")){
					fiberType = fiberType.replace("Pi", "PI")
					fiberType = fiberType.replace("Bg1", "BG1")
					fiberType = fiberType.replace("Sigma", "SIGMA")
					fiberType = fiberType.replace("Bg2", "BG2")
				}

				let value = JSON.parse(String(data)).value
				let action = ''

				switch(property){
					case "tcrn":
						action = "setOvenTcrn"
						break
					case "heat_on":
						action = "setOvenHeat_on"
						break
					default:
						//take no action - avoids unwanted topics
						return
				}
				this.$store.dispatch(action, {fiberType, value})
			},
			'codac/das/diag/msx/config/ovens/#' (data, topic) {
				let subTopics = topic.split("/")

				let property = subTopics[subTopics.length - 1]
				let oven = subTopics[subTopics.length - 2]
				let value = JSON.parse(String(data)).value
				let action = ''

				switch(property){
					case "tset":
						action = "setOvenTset"
						break
					case "active":
						action = "setOvenState"
						break
					case "wltarget":
						action = "setWLTarget"
						break
					case "m":
						action = "setOvenFitM"
						//topics string longer for this case
						oven = subTopics[subTopics.length - 3]
						break
					case "c":
						action = "setOvenFitC"
						//topics string longer for this case
						oven = subTopics[subTopics.length - 3]
						break
					default:
						//take no action - avoids unwanted topics
						return
				}

				if(!oven.includes("PMT") && !oven.includes("PY")){
					//not a valid fiberType, cannot access
					return
				}
				console.log("from broker sub:", oven, value)
				this.$store.dispatch(action, {oven, value})
			},
			'codac/das/diag/msx/config/volts/+/+/detector' (data, topic) {
				let topicStructure = topic.split("/")
				let source = topicStructure[topicStructure.length - 3]
				let feed = topicStructure[topicStructure.length - 2]
				
				let hvsource =  source + ":" +feed[feed.length - 1]
				let detector = JSON.parse(String(data)).value
				this.$store.dispatch('setDetectorHVPair', {hvsource, detector})
			},
			'codac/das/diag/+/cstate' (data, topic){
				let subTopics = topic.split("/")

				let value = JSON.parse(String(data)).value
				let diagnostic = ""

				if(subTopics[subTopics.length - 2] == "msx"){
					diagnostic = "msxrunning"
					this.$store.dispatch("setStatus", {diagnostic, value})
				}else if (subTopics[subTopics.length - 2] == "msr"){
					diagnostic = "msrrunning"
					this.$store.dispatch("setStatus", {diagnostic, value})
				}else if (subTopics[subTopics.length - 2] == "mss"){
					diagnostic = "mssrunning"
					this.$store.dispatch("setStatus", {diagnostic, value})
				}
			},
			'codac/das/diag/msx/config/command' (data){
				//commands not sent as JSON
				//only want to receive response, so ignore if not json
				let value = JSON.parse(String(data)).value

				this.$store.dispatch("setCommand", value)
			}
		}
	}
</script>