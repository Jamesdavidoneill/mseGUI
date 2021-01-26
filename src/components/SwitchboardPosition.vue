<template>
	<div>
		<v-card  
			@click="openDialog"
			v-bind:class="{
				'indigo darken-1': boardPos.fiberType == 'PY',
				'white--text': boardPos.fiberType == 'PY' || boardPos.fiberType == 'PMT',
				'grey lighten-1': boardPos.fiberType == 'n/a',
				'grey--text text--darken-1': boardPos.fiberType == 'n/a',
				'teal darken-1': boardPos.fiberType == 'PMT'}"
			>
			<div>
				<p
				v-bind:class="{
					'smallest-screen' : $vuetify.breakpoint.width < 350,
					'small-screen' : $vuetify.breakpoint.width < 600}"
				>
					{{pos.x + 1}}-{{pos.y + 1}}
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-icon
								:class="status.colorClass"
								v-bind="attrs"
								v-on="on">
								{{status.icon}}
							</v-icon>
						</template>
						<span>{{status.tooltip}}</span>
					</v-tooltip>
				</p>
				<p
				v-if="$vuetify.breakpoint.width >= 610"
				v-bind:class="{
					'smallest-screen' : $vuetify.breakpoint.width < 700,
					'med-screen' : $vuetify.breakpoint.width < 890,
					}"
				>{{boardPos.fiberName}}</p>
				<p
				v-if="$vuetify.breakpoint.width < 610"
				class='small-screen'>
				{{boardPos.fiberType}}</p>
			</div>		
			<v-dialog v-model="dialog" max-width="700px">
				<v-card>
					<EditMenu
						:pos="pos"
						:isEditing="isEditing"
						ref="EditMenu"
					>
					</EditMenu>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="indigo darken-1" text @click="closeDialog">Close</v-btn>
						<v-btn
							:disabled="!isEditing"
							color="success"
							@click="saveDialog"
						>
							Save
						</v-btn>
						<v-btn
							color="indigo darken-1"
							fab
							small
							class="white--text"
							@click="isEditing = !isEditing"
						>
							<v-icon v-if="isEditing">mdi-close</v-icon>
							<v-icon v-else>mdi-pencil</v-icon>
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-card>
	</div>
</template>

<script>
	import EditMenu from './EditMenu'
	export default {
		name: 'SwitchboardPosition',
		components: {
			EditMenu
		},
		props: {
			pos: Object
		},
		data () {
			return {
				isEditing: false,
				dialog: false
			}
		},
		methods: {
			saveDialog() {
				if(this.$refs.EditMenu.submitForm()){
					this.isEditing = false

				}
			},
			openDialog(){
				this.dialog = true
				if(this.$refs.EditMenu){
					this.$refs.EditMenu.setForm()
				}
			},
			closeDialog(){
				this.dialog = false
				this.isEditing = false
				this.$refs.EditMenu.alert = false
			}
		},
		computed: {
			boardPos(){
				return this.$store.getters.getBoardPosition({x:this.pos.x, y:this.pos.y})
			},
			status(){
				let crnStatus = {
					icon: "mdi-check-circle",
					colorClass: "light-green--text",
					tooltip: "Configured correctly"}
				if(this.boardPos.fiberName == 'n/a'){
					crnStatus ={
						icon: "mdi-block-helper",
						colorClass: "grey--text",
						tooltip: "Not connected"
					}
				}
				return crnStatus
			}
		}
	}
</script>
<style>
	.smallest-screen{
		font-size: 0.65em;
	}
	.small-screen{
		font-size: 0.75em;
	}
	.med-screen{
		font-size: 0.9em;
	}
</style>