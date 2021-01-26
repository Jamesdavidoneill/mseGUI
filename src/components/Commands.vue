<template>
	<div id="openCommand">
		<v-btn 
			color="indigo darken-1"
			class="white--text"
			@click="dialog = true"
		>
			Send Command
		</v-btn>
		<v-dialog v-model="dialog" max-width="700px">
				<v-card>
					<v-tabs
						fixed-tabs
						background-color="indigo"
						icons-and-text
						disabled="true"
						dark
					>
						<v-tab>
							Send Commands To Back End
							<v-icon>mdi-console</v-icon>
						</v-tab>
					</v-tabs>
						
					<v-alert :type="alertType"
					>
						response: 
						{{response}}
					</v-alert>
					<v-container
						class="justify-center"
					>
						<v-row dense class="cmdRow">
							<v-col cols="4">
								<v-btn
									@click="sendCmd('hvoff')"
									color="indigo darken-1"
									class="white--text"
								>
									hvoff	
								</v-btn>
							</v-col>
							<v-col cols="4">
								<v-text-field
									class="d-inline"
									label="Call shot or voltage"
									type="number"
									v-model="wlNum"
								>
								</v-text-field>
							</v-col>
							<v-col cols="4">
								<v-btn
									class="d-inline white--text"
									@click="sendCmd('wavelength-' + wlNum)"
									color="indigo darken-1"
								>
									wavelength-{{wlNum}}	
								</v-btn>
							</v-col>
							
						</v-row>
						<v-row dense class="cmdRow">
							<v-col cols="3">
								<v-btn
									@click="sendCmd('commit')"
									color="indigo darken-1"
									class="white--text"
								>
									commit	
								</v-btn>
							</v-col>
							<v-col cols="3">
								<v-btn
									@click="sendCmd('commit-hv')"
									color="indigo darken-1"
									class="white--text"
								>
									commit-hv	
								</v-btn>
							</v-col>
							<v-col cols="3">
								<v-btn
									@click="sendCmd('commit-sb')"
									color="indigo darken-1"
									class="white--text"
								>
									commit-sb	
								</v-btn>
							</v-col>
							<v-col cols="3">
								<v-btn
								@click="sendCmd('commit-ot')"
									color="indigo darken-1"
									class="white--text"
								>
									commit-ot	
								</v-btn>
							</v-col>
						</v-row>
						<v-row dense class="cmdRow">
							
							<v-col cols="3">
								<v-btn
									@click="sendCmd('load-default-D')"
									color="indigo darken-1"
									class="white--text"
								>
									load-default-D	
								</v-btn>
							</v-col>
							<v-col cols="3">
								<v-btn
									@click="sendCmd('load-default-H')"
									color="indigo darken-1"
									class="white--text"
								>
									load-default-H	
								</v-btn>
							</v-col>
							<v-col cols="3">
								<v-btn
									@click="sendCmd('store-default-D')"
									color="indigo darken-1"
									class="white--text"
								>
									store-default-D	
								</v-btn>
							</v-col>
							<v-col cols="3">
								<v-btn
									@click="sendCmd('store-default-H')"
									color="indigo darken-1"
									class="white--text"
								>
									store-default-H	
								</v-btn>
							</v-col>
						</v-row>
						<v-row dense class="cmdRow">
							<v-col cols="4">
								<v-btn
									@click="sendCmd('load-sfh')"
									color="indigo darken-1"
									class="white--text"
								>
									load-sfh	
								</v-btn>
							</v-col>
							<v-col cols="3">
								<v-text-field
									class="d-inline"
									label="Shot Number"
									type="number"
									v-model="shotNum"
								>
								</v-text-field>
							</v-col>
							<v-col cols="3">
								<v-btn
									class="d-inline white--text"
									@click="sendCmd('load-sfh-' + shotNum)"
									color="indigo darken-1"
								>
									load-sfh-{{shotNum}}	
								</v-btn>
							</v-col>
						</v-row>
					</v-container>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn flex
						color="indigo darken-1" text @click="dialog = false">Close</v-btn>
					</v-card-actions>

				</v-card>
			</v-dialog>
	</div>
</template>
<script>
	export default {
		name: 'Commands',
		data() {
			return {
				dialog: false,
				tab: null,
				shotNum: 2000,
				wlNum: 60.4
			}
		},
		methods: {
			sendCmd(cmd){
				//handle edge case
				//If user has selected no shotnumber, then
				//command menu may send false values.
				//Account for that here
				if(cmd == "load-sfh-"){
					cmd = "load-sfh"
				}
				const topic = "codac/das/diag/msx/config/command"

				const time = new Date().getTime()

				const data = {
				value: cmd,
				time: time
				}
				this.$mqtt.publish(topic,JSON.stringify(data) , {retain:false})
				//this.$mqtt.publish(topic, cmd , {retain:false})
			}
		},
		computed: {
			response(){
				return this.$store.getters.command
			},
			alertType(){
				if(this.response == "ok"){
					return "success"
				}
				return "warning"
			}
		}
	}
</script>
<style>
	#openCommand{
		margin: 5px;
	}
	.cmdRow{
		margin: 5px 0;
	}
</style>