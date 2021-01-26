<template>
	<div class="grey">
		<div v-if="!connecting">
			<div class="statusdisplay" >
			<v-card>
				<h4>
					MSX running:{{status.msxrunning.state}}
					<v-icon :class="status.msxrunning.colorClass">
						{{status.msxrunning.icon}}
					</v-icon>
				</h4>

				<h4>
					MSR running:{{status.msrrunning.state}}
					<v-icon :class="status.msrrunning.colorClass">
						{{status.msrrunning.icon}}
					</v-icon>
				</h4>

				<h4>
					MSS running:{{status.mssrunning.state}}
					<v-icon :class="status.mssrunning.colorClass">
						{{status.mssrunning.icon}}
					</v-icon>
				</h4>
			</v-card>
			</div>
		</div>
		<v-dialog
		v-model="connecting"
		hide-overlay
		persistent
		width="300"
		>
			<v-card
			color="primary"
			dark
			>
				<v-card-text>
				Attempting to connect to broker
					<v-progress-linear
						indeterminate
						color="white"
						class="mb-0"
					></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>

</template>
<script>
	export default {
		name: 'Status',
		computed: {
			//returns the current status of the diagnostic
			//and how to display it on the gui
			status(){
				//Access status stored on broker
				let diagStatus = this.$store.getters.status
				let msxColorClass
				let msxIcon
				let msxMsg = ""
				let msrColorClass
				let msrIcon
				let msrMsg = ""
				let mssColorClass
				let mssIcon

				//Display for msx diagnostic
				if(diagStatus.msxrunning == "OK"){
					msxColorClass = "green--text"
					msxIcon = "mdi-check-circle"
				}else if(diagStatus.msxrunning == "OFF"){
					msxColorClass = "grey--text"
					msxIcon = "mdi-block-helper"
				}else{
					msxColorClass = "red--text"
					msxIcon = "mdi-help-circle"
					msxMsg = "<<UNRECOGNISED STATUS VALUE>>"
				}
				//Display for msr diagnostic
				if(diagStatus.msrrunning == "OK"){
					msrColorClass = "green--text"
					msrIcon = "mdi-check-circle"
				}else if(diagStatus.msrrunning == "OFF"){
					msrColorClass = "grey--text"
					msrIcon = "mdi-block-helper"
				}else if(diagStatus.mssrunning == "ERROR"){
					msrColorClass = "red--text"
					msrIcon = "mdi-alert"
				}else{
					msrColorClass = "red--text"
					msrIcon = "mdi-help-circle"
					msrMsg = "<<UNRECOGNISED STATUS VALUE>>"
				}
				//Display for mss diagnostic
				if(diagStatus.mssrunning == "OFF"){
					mssColorClass = "grey--text"
					mssIcon = "mdi-block-helper"
				}else if(diagStatus.mssrunning == "ERROR"){
					mssColorClass = "red--text"
					mssIcon = "mdi-alert"
				}else{
					mssColorClass = "green--text"
					mssIcon = "mdi-check-circle"
				}
				//Return object based on properties set
				return {
					msxrunning:{
						state: diagStatus.msxrunning + msxMsg,
						colorClass: msxColorClass,
						icon: msxIcon
					},
					msrrunning: {
						state: diagStatus.msrrunning + msrMsg,
						colorClass: msrColorClass,
						icon: msrIcon
					},
					mssrunning:{
						state: diagStatus.mssrunning,
						colorClass: mssColorClass,
						icon: mssIcon
					}
				}
			},
			connecting (){
				return !this.$store.getters.connected
			}
		}

	}
</script>
<style>
.statusdisplay {
	padding: 5px;
}
</style>