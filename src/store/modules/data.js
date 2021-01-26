import Vue from 'vue'
/*	DATA STORAGE FOR GUI*/

/* CREATE STRUCTURES TO STORE DATA*/
/*Object to store fiberType at switchboard position*/
class switchboardPosition {
	constructor(){
		this.fiberType = ''
		this.fiberName = ''
	}
}
/*Generates array for board*/
let board =[]
for(let i = 0; i < 10; i++){
	let column = [];
	for(let j = 0; j < 6; j++){
		column.push(new switchboardPosition())
	}
	board.push(column)
}
/*Generate space to store ovens*/
//PMTs

//create empty object to store oven properties
let ovens = {}
//Create 10 ovens, one for each PMT
for(let i = 1; i < 11; i++){

	//number the PMT, make sure the number is 2 digits long
	let num = ("0" + i).slice(-2)
	//name the PMT
	let string = "PMT_" + num
	//Add a new oven, with properties to store values from broker
	ovens[string] = {
		tcrn: '',
		tset: '',
		heat_on: '',
		state: '',
		hvsource:'',
		fitM: '',
		fitC: '',
		wltarget: ''
	}
}
//PYs
for(let i = 1; i < 5; i++){
	for(let j = 0; j < 4; j++){
		let fiberTypeNum = ("0" + i).slice(-2)
		let channel
		if(j == 0){
			channel = "PI"
		}else if(j == 1){
			channel = "SIGMA"
		}else if(j == 2){
			channel = "BG1"
		}else if(j == 3){
			channel = "BG2"
		}
		let string = "PY_" + fiberTypeNum + "_" + channel
		ovens[string] = {
			tcrn: '',
			heat_on: '',
			state: '',
			hvsource: '',
			fitM: '',
			fitC: '',
			wltarget: ''
		}
	}
}
	
let feed = {}
//HV source feeds
for(let i = 0; i< 10; i++){
	let string = "HV_"
	string += String(i * 2 + 1)
	string += "_"
	string += String(i * 2 + 2)

	feed[string + ":0"] ={
		value: '',
		oven: ''
	}
	feed[string + ":1"] = {
		value: '',
		oven: ''
	}
}
//Diagnostic status
let status = {
	connected: false,
	msxrunning: "",
	msrrunning: "",
	mssrunning: "",
}
/*Store state of all data in gui*/
const state = {
	status:status,
	board: board,
	feed: feed,
	ovens: ovens,
	command: ''
}

/*Allow other parts of the application to access and read data*/
const getters = {
	connected: state => state.status.connected,
	command: state => state.command,
	status: state => state.status,
	ovens: state => state.ovens,
	feed: state => state.feed,
	getFeedChannel: state => name =>{
		if(name){
			let parts = name.split("_")
			let voltSource = parts[1]
			let channel = parts[2].split(":")[1]

			let index = parseInt(voltSource) - 1 + parseInt(channel)
			return state.feed[index]
		} else{
			return "N/A"
		}
		
	},
	getBoardPosition: state => pos => {
		return state.board[pos.x][pos.y]
	}
}
/*Actions are called by other parts of the application to set data*/
const actions = {
	setCommand(context, value){
		context.commit('setCommand', value)
	},
	setConnected(context, value){
		context.commit('setConnected', value)
	},
	setfiberType(context, {x, y, value}){
		context.commit('setfiberType', {x, y, value})
	},
	setfiberName(context, {x, y, value}){
		context.commit('setfiberName', {x, y, value})
	},
	setFeedValue(context, {index, value}){
		context.commit('setFeedValue', {index, value})
	},
	setHVValue(context, {x, y, value}){
		context.commit('setHVValue', {x, y, value})
	},
	setOvenTcrn(context, {fiberType, value}){
		context.commit('setOvenTcrn', {fiberType, value})
	},
	setOvenTset(context, {oven, value}){
		context.commit('setOvenTset', {oven, value})
	},
	setOvenHeat_on(context, {fiberType, value}){
		context.commit('setOvenHeat_on', {fiberType, value})
	},
	setOvenState(context, {oven, value}){
		context.commit('setOvenState', {oven, value})
	},
	setStatus(context, {diagnostic, value}){
		context.commit('setStatus', {diagnostic, value})
	},
	setDetectorHVPair(context, {hvsource, detector}){
		context.commit('setDetectorHVPair', {hvsource, detector})
	},
	setOvenFitM(context, {oven, value}){
		context.commit('setOvenFitM', {oven, value})
	},
	setOvenFitC(context, {oven, value}){
		context.commit('setOvenFitC', {oven, value})
	},
	setWLTarget(context, {oven, value}){
		context.commit('setWLTarget', {oven, value})
	}
}
/*Actions call mutations to directly manipulate data, as per Vuex structure.*/
const mutations = {
	setCommand(state, value){
		state.command = value
	},
	setConnected(state, value){
		state.status.connected = value
	},
	setfiberType(state, {x, y, value}){
		state.board[x][y].fiberType = value;
	},
	setfiberName(state, {x, y, value}){
		state.board[x][y].fiberName = value
	},
	setFeedValue(state, {index, value}){
		Vue.set(state.feed, index, {value, oven:state.feed.oven})
	},
	setHVValue(state, {x, y, value}){
		state.board[x][y].PMT.hvlabel = value;
		state.board[x][y].PY.pi.hvlabel = value;
	},
	setOvenTcrn(state, {fiberType, value}){
		state.ovens[fiberType].tcrn = value
	},
	setOvenTset(state, {oven, value}){
		state.ovens[oven].tset = value
	},
	setOvenHeat_on(state, {fiberType, value}){
		state.ovens[fiberType].heat_on = value
	},
	setOvenState(state, {oven, value}){
		//value read from broker either as 1 or 0
		//convert to true or false
		if(parseInt(value) == 1){
			value = true
		}else{
			value = false
		}
		state.ovens[oven].state = value
	},
	setStatus(state, {diagnostic, value}){
		state.status[diagnostic] = value
	},
	setDetectorHVPair(context, {hvsource, detector}){
		//break previous connection
		const previousOven = state.feed[hvsource].oven
		if( previousOven != "n/a" && previousOven){
			state.ovens[state.feed[hvsource].oven].hvsource = ""
		}
		//break connections to another hv source
		if(detector != "n/a" && detector){
			const previousHV = state.ovens[detector].hvsource
			if( previousHV != "n/a" && previousHV){
				state.feed[previousHV].oven = ""
			}
		}
		//set new connection
		state.feed[hvsource].oven = detector
		if(detector != "n/a"){

			state.ovens[detector].hvsource = hvsource
		}
	},
	setOvenFitM(state, {oven, value}){
		state.ovens[oven].fitM = value
	},
	setOvenFitC(state, {oven, value}){
		state.ovens[oven].fitC = value
	},
	setWLTarget(state, {oven, value}){
		console.log(oven, value)
		state.ovens[oven].wltarget = value
	}
}
/*export everything for access in app components*/
export default {
	state,
	getters,
	actions,
	mutations
}