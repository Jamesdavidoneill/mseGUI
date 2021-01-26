<template>
	<div>
		<Commands v-if="!connecting"></Commands>
		<v-container
			class="grey"
			no-gutters
			fluid
			v-if="!connecting"
		>
			<v-row
				class="justify-space-between"
				no-gutters
				v-for="j in 6" :key="j"
			>
				<v-col :cols="1" v-for="i in 10" :key="i">
					<SwitchboardPosition v-bind:pos="{x:10 - i , y:j-1}"></SwitchboardPosition>
				</v-col>
			</v-row>
		</v-container>
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
					>
					</v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	import SwitchboardPosition from '../components/SwitchboardPosition.vue'
	import Commands from '../components/Commands.vue'
	export default{
		name: 'switchboard',
		components: {
			SwitchboardPosition,
			Commands
		},
		computed: {
			connecting (){
				return !this.$store.getters.connected
			}
		}
	}
</script>