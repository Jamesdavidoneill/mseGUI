<template>
  <div>
    <v-tabs
    v-model="tab"
    centered
    background-color="indigo"
    dark
    icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
      Name
        <v-icon>mdi-panorama-wide-angle</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
      Voltage Sources
       <v-icon>mdi-washing-machine</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
      Ovens
        <v-icon>mdi-fireplace</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-alert
        v-model="alert"
        close-text="Close Alert"
        type="error"
        dismissible
      >
        {{status.alertText}}
      </v-alert>
      <!-- FIRST MENU SECTION -->
      <v-tab-item value="tab-1">
      <v-card flat>
        <v-container>
          <v-row>
            <v-radio-group
              v-model="form.fiberType"
              :disabled="!isEditing"
              row
            >
              <v-radio label="Disconnected" value="n/a"></v-radio>
              <v-radio label="Photomultiplier Tube" value="PMT"></v-radio>
              <v-radio label="Polychromator" value="PY"></v-radio>
            </v-radio-group>
          </v-row>
          <v-row v-if="form.fiberType !== 'n/a'">
            <v-col cols="12">
              <v-select
                v-model="form.fiberName"
                :items="choosefiberType"
                :disabled="!isEditing"
                append-outer-icon="mdi-video-input-hdmi"
                menu-props="auto"
                hide-details
                label="Name"
                single-line
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      </v-tab-item>

      <!-- SECOND MENU SECTION -->
      <v-tab-item value="tab-2">
      <v-card flat>
        <v-container>
          <span v-if="form.fiberType == 'n/a'">
            <v-card-title>There is no fiberType connected to this position</v-card-title>
          </span>
          <span v-else>
            <v-row>
              <v-col>
                <v-card-text>
                  <span class="mb-4">FIBER: {{form.fiberName}}</span>
                </v-card-text>
                <!-- <v-card-text>
                  {{form.fiberName}}
                </v-card-text> -->
              </v-col>
            </v-row>
            <v-row v-for="(source, name) in form.hvsources" :key="name">
              <v-col cols="2">
                <v-card-subtitle>{{name}}</v-card-subtitle>
              </v-col>
              <v-col cols="3">
                <v-card-text>
                  Volts: <span v-if="feed[source.hvlabel]">{{feed[source.hvlabel].value}} V</span>
                </v-card-text> 
              </v-col>
               <v-col cols="3">
                 <v-select
                  :disabled="!isEditing"
                  v-model="form.hvsources[name].hvlabel"
                  :items="HVNames"
                  append-outer-icon="mdi-video-input-hdmi"
                  hide-details
                  label="HV label"
                  single-line
                >
                </v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field label="Set voltage"
                type="number"
                v-model="form.hvsources[name].voltset"
                :disabled="!isEditing"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </span>
        </v-container>
      </v-card>
      </v-tab-item>

      <!-- THIRD MENU SECTION -->
      <v-tab-item value="tab-3">
      <v-card flat>
        <span v-if="!status.oven.ovenConnected">
          <v-card-title>There is no oven connected to this fiberType</v-card-title>
        </span>
        <span v-if="form.fiberType == 'n/a' && ovens[form.fiberName]">
          <v-card-title>There is no fiberType connected to this position</v-card-title>
        </span>
        <span v-if="(form.fiberType == 'PMT' || form.fiberType == 'PY') && status.oven.ovenConnected">
          <v-list-item>
              <v-card-text>
                <span class="mb-4">FIBER: {{form.fiberName}}</span>
              </v-card-text>
              <v-select
                v-model="filter"
                :items="filterNames"
                filled
                dense
              ></v-select>
          </v-list-item>
          <v-list-item>
                <v-list-item-icon>
                  <v-icon :class="status.oven.stateColorClass">
                    {{status.oven.stateIcon}}   
                  </v-icon>
                </v-list-item-icon>
                {{status.oven.text}}
                <v-switch
                inset
                class="ml-2"
                v-model="form.ovens[filter].setactive"
                :disabled="!isEditing"
                >
              </v-switch>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>
                mdi-thermometer
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Current Temp: {{status.oven.tcrn}} <v-icon>mdi-temperature-celsius</v-icon>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-thermometer-alert</v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-text-field label="Set Temp"
              type="number"
              v-model="form.ovens[filter].tset"
              :disabled="!isEditing"
              required></v-text-field></v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-sine-wave</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Target Wavelength (From Torus): {{status.oven.wltarget}} nm</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-sine-wave</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Current Filter Wavelength: {{status.oven.wlcrn}} nm</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-sine-wave</v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-text-field label="Set Filter Wavelength"
              type="number"
              v-model="wavelength"
              :disabled="!isEditing"
              required></v-text-field></v-list-item-title>
          </v-list-item>
        </span>
      </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  export default {
    name: 'EditMenu',
    data () {
      return {
        /*stores data for form while being edited*/
        form: {
          fiberType: '',
          fiberName: '',
          hvsources: {},
          ovens: {}
        },
        /*variables used for UI elements and navigation*/
        filter: "",
        tab : null,
        alert: false,
        //List of PMT fiber names user selects from
        PMTNames: [
          'PMT_01', 'PMT_02', 'PMT_03', 'PMT_04', 'PMT_05', 'PMT_06', 'PMT_07', 'PMT_08', 'PMT_09', 'PMT_10' 
        ],
        //List of PY fiber names user selects from
        PYNames: [
          'PY_01_01', 'PY_01_02', 'PY_01_03', 'PY_01_04', 'PY_02_01', 'PY_02_02', 'PY_02_03', 'PY_02_04', 'PY_03_01', 'PY_03_02', 'PY_03_03', 'PY_03_04', 'PY_04_01', 'PY_04_02', 'PY_04_03', 'PY_04_04', 
        ],
        //List of High Voltage sources the user can select from
        HVNames: [
          'HV_1_2:0', 'HV_1_2:1', 'HV_3_4:0', 'HV_3_4:1', 'HV_5_6:0', 'HV_5_6:1', 'HV_7_8:0', 'HV_7_8:1', 'HV_9_10:0', 'HV_9_10:1', 'HV_11_12:0', 'HV_11_12:1', 'HV_13_14:0', 'HV_13_14:1', 'HV_15_16:0', 'HV_15_16:1', 'HV_17_18:0', 'HV_17_18:1', 'HV_19_20:0', 'HV_19_20:1', 
        ],
        //list of filter names user can select from. Dynamically set
        filterNames: []

      }
    },
    mounted : function () {
      //When form first opened, make sure it is set up correctly
      this.setForm()
    },
    //values passed to this component from parent component
    props: [ 'pos', 'isEditing'],
    methods:{
      //Verifies that all the information submitted to the edit form is valid before
      //sending to the broker
      checkForm(form){
        //Must have a named fiber selected
        if(form.fiberType == "PMT" && !form.fiberName.includes("PMT")){
          //mismatch in fiber name and type
          this.status.alertText = "User must select a fiber name"
          return false
        }
        if(form.fiberType == "PY" && !form.fiberName.includes("PY")){
          //mismatch in fiber name and type
          this.status.alertText = "User must select a fiber name"
          return false
        }
        if(form.fiberType == "PY"){
          //check user hasn't selected two of same voltage sources
          let detectors = ["PI", "BG1", "SIGMA", "BG2"]
          for(let i = 0; i < 4; i++){
            //detector to compare to others
            let reference = detectors[i]
            for(let j = i + 1; j < 4; j++){
              let testDetector = detectors[j]
              if(this.form.hvsources[reference].hvlabel == this.form.hvsources[testDetector].hvlabel){
                //Same filter appears twice !!!

                //check that they aren't both blank
                if(this.form.hvsources[reference].hvlabel != ""){
                  this.status.alertText = "Multiple detectors have the same HV source selected"
                  return false
                }
              }
            }
          }
        }
        //otherwise, form is correct
        return true
      },
      //Publishes data saved in form to the MQTT broker
      submitForm(){
        if(this.checkForm(this.form)){
          //stop displaying the alert
          this.alert = false

          //publish form data to broker
          this.publishFiberName()
          this.publishVoltages()
          this.publishOven()
          
          //publish successful
          return true
        }
        else{
          //If form fails formCheck() then display alert
          this.alert = true
          return false
        }    
      },
      //Sets up form when menu is first opened
      setForm(){
        //Take current data about board position and store in new form object
        const boardPos = this.$store.getters.getBoardPosition({x:this.pos.x, y:this.pos.y})
        this.$set(this.form, 'fiberType', boardPos.fiberType)
        this.$set(this.form, 'fiberName', boardPos.fiberName)
        
        //Add info about ovens to form
        this.refreshFilters(this.form.fiberType)
        //set up voltage source menu
        this.refreshVoltageSources(this.form.fiberType) 
      },
      //Updates the menu section displaying the voltage sources connected to 
      //each detector/filter reached by a fiber
      //Number of menu elements changes depending on whether the fiber connected
      //leads to a polychromator or to a photomultiplier tube.
      //Takes an argument to tell what fiberType is connected
      //Method is called either when the menu is first opended, or when
      //the type of fiberType selected is changed      
      refreshVoltageSources(fiberType){
        if(fiberType=="PMT"){
          let DETECTOR = {
            hvlabel : this.ovens[this.form.fiberName] ? this.ovens[this.form.fiberName].hvsource : "",
            voltset : "",
            setsfh : false
          }
          //empty hv sources
          this.form.hvsources = {}
          //and add new contents
          this.form.hvsources["DETECTOR"] = DETECTOR
          return
        }
        if(fiberType=="PY"){
          //empty hv sources
          this.form.hvsources = {}

          //Find which detector connection is to
          let polyName = this.polyFiberToPolyName(this.form.fiberName)
          polyName += "_"
          //and add new contents
          let detectors = ["PI", "BG1", "SIGMA", "BG2"]
          //For callback, store reference to "this"
          let self = this
          detectors.forEach(function(detector){
            self.form.hvsources[detector] = {
              hvlabel : self.ovens[polyName + detector] ? self.ovens[polyName + detector].hvsource : "",
              voltset : "",
              setsfh : false
            }
          })
        }
      },
      //Updates menu display section for filters and oven temperatures
      //The number displayed depends on whether a fiber connecting to a 
      //photomultiplier tube or a polychromator is selected
      refreshFilters(fiberType){
        if(fiberType == "PMT"){
          //Set list of filter names available to select
          this.filterNames = ["FILTER"]
          this.filter = "FILTER"

          //first clear filters
          this.form.ovens = {}
          //Find what the current set temp
          //and active state are
          let tset = ""
          let setactive = false
          let fitM = 0
          let fitC = 0

          if(this.ovens[this.form.fiberName]){
            tset =this.ovens[this.form.fiberName].tset
            setactive = this.ovens[this.form.fiberName].state
            fitM = this.ovens[this.form.fiberName].fitM
            fitC = this.ovens[this.form.fiberName].fitC
          }
          this.$set(this.form.ovens, "FILTER", {})
          this.$set(this.form.ovens["FILTER"], 'tset', tset)
          this.$set(this.form.ovens["FILTER"], 'setactive', setactive)
      
          this.$set(this.form.ovens["FILTER"], 'fitM', fitM)
          this.$set(this.form.ovens["FILTER"], 'fitC', fitC)
        }
        if(fiberType == "PY"){
          //Set list of filter names available to select
          this.filterNames = ["PI", "SIGMA"]
          //by default "PI" selected
          this.filter = "PI"

          //clear ovens
          this.form.ovens = {}
          //and add new ones
          let filters = ["PI", "SIGMA"]
          //For callback, store reference to "this"
          let self = this
          filters.forEach(function(filter){

            let tset = ""
            let setactive = 0
            let fitM = 0
            let fitC = 0

            let PYName = self.form.fiberName.split("_")[0] + "_" + self.form.fiberName.split("_")[1] + "_"
            let fullOvenName = PYName + filter

            if(self.ovens[fullOvenName]){
              tset = self.ovens[fullOvenName].tset
              setactive = self.ovens[fullOvenName].state
              fitM = self.ovens[fullOvenName].fitM
              fitC = self.ovens[fullOvenName].fitC
            }
            self.$set(self.form.ovens, filter, {})
            self.$set(self.form.ovens[filter], 'tset', tset)
            self.$set(self.form.ovens[filter], 'setactive', setactive)
            self.$set(self.form.ovens[filter], 'fitM', fitM)
            self.$set(self.form.ovens[filter], 'fitC', fitC)

          })
        }
      },
      publishFiberName(){
        let topic
        let time
        let data
        
        /*SUBMIT FIBER NAME*/
        let col = this.pos.x + 1
        let row = this.pos.y + 1

        col = ('0' + col).slice(-2)
        row = ('0' + row).slice(-2)


        topic = 'codac/das/diag/msx/cstate/board/col' + col + '/row' + row
        time = new Date().getTime()

        let fiberName = this.form.fiberName
        
        //If user has selected n/a, then no fiber is connected
        if(this.form.fiberType == 'n/a'){
          fiberName = 'n/a'
        }

        data = {
          value: fiberName,
          time: time
        }
        
        //publish to broker
        this.$mqtt.publish(topic, JSON.stringify(data), {retain:true})
      },
      publishVoltages(){
        let topic
        let time
        let data

        /*SUBMIT HV SOURCE AND VOLTSET*/
        if(this.form.fiberType == "PMT" || this.form.fiberType == "PY"){
          for(const detector in this.form.hvsources){
            //first, publish connection to hv source
            let hvlabel = this.form.hvsources[detector].hvlabel
            //check if hvlabel is valid
            if(hvlabel){
              let sourcePair = hvlabel.slice(0, hvlabel.length - 2)
              let channel = hvlabel.slice(hvlabel.length - 1)

              topic = "codac/das/diag/msx/config/volts/" + sourcePair + "/feed_" + channel + "/detector"
              time = new Date().getTime()

              let fullDetectorName
              //Different name access for PMT vs PY
              if(this.form.fiberType == "PY"){
                let PYName = this.form.fiberName.split("_")[0] + "_" + this.form.fiberName.split("_")[1] + "_"
                fullDetectorName = PYName + detector
              }else{
                fullDetectorName = this.form.fiberName
              }
              
              data = {
                  value: fullDetectorName,
                  time: time
                }
              this.$mqtt.publish(topic, JSON.stringify(data), {retain:true})

              //next, publish voltset
              //check if user has submitted values
              if(this.form.hvsources[detector].voltset){
                //publish to config topic
                topic = "codac/das/diag/msx/config/volts/" + sourcePair + "/feed_" + channel + "/voltset"
                let volts = this.form.hvsources[detector].voltset
                data = {
                  value: volts,
                  time: time
                }
                this.$mqtt.publish(topic, JSON.stringify(data), {retain:true})
              }
            }
          } 
        }
      },
      publishOven(){
        let topic
        let time
        let data

        /*SUBMIT TARGET TEMPERATURE OF OVEN*/
        //check oven exists
        let validOven = this.status.oven.ovenConnected && (this.form.fiberName.includes("PY") || this.form.fiberName.includes("PMT"))
        if( validOven){
          for (const filter in this.form.ovens){
            if(this.form.ovens[filter].tset){
              let ovenName = ""
              if(this.form.fiberType == "PY"){
                let PYName = this.form.fiberName.split("_")[0] + "_" + this.form.fiberName.split("_")[1] + "_"
                ovenName = PYName + filter
              }else{
                ovenName = this.form.fiberName
              }
              
              topic = 'codac/das/diag/msx/config/ovens/' + ovenName + '/tset'
              time = new Date().getTime()
              let value = this.form.ovens[filter].tset
              
              data = {
                value: value,
                time: time
              }
              //publish
              this.$mqtt.publish(topic, JSON.stringify(data), {retain:true})

              topic = 'codac/das/diag/msx/config/ovens/' + ovenName + '/active'
              //convert from true or false to 1 or 0
              if(this.form.ovens[filter].setactive){
                value = 1
              }else{
                value = 0
              }
              data = {
                value: value,
                time: time
              }
              //publish
              this.$mqtt.publish(topic, JSON.stringify(data), {retain:true})

            }
          }
        }
      },
      polyFiberToPolyName(fiber){
        //fibers going to polychromator labelled as PY_01_01, PY_02_03 etc
        //
        //Each polychromator takes 4 fibers,
        //so PY_01_01, PY_01_02, PY_01_03, PY_01_04 all connect to PY_01
        //
        //This method takes the fiber name and returns the polychromator it connects to
        
        //changes only needed if fiber is connected to a Polychromator
        if(fiber.includes("PY")){
          //Find which detector connection is to
          return fiber.split("_")[0] + "_" + fiber.split("_")[1]
        }
        //no changes needed
        return fiber
      },
      tempToWl(temp){
        if(temp){
          if(this.form.ovens[this.filter]){
            let m = this.form.ovens[this.filter].fitM
            let c = this.form.ovens[this.filter].fitC
            
            temp = parseFloat(temp)
            return m * temp + c
          }
        }
        return null
      },
      wlToTemp(wl){
        if(wl){
          if(this.form.ovens[this.filter]){
            let m = this.form.ovens[this.filter].fitM
            let c = this.form.ovens[this.filter].fitC
          
            wl = parseFloat(wl)
            //CHECK FOR DIVIDE BY 0 EXCEPTION
            if(m == 0){
              return null
            }
            return (wl - c)/m
          }
        }
        return null
      },
    },
    watch: {
      'form.fiberName'(){
        //If fiberType name has changed, need to update which voltage sources are connected
        this.refreshVoltageSources(this.form.fiberType)
        //If fiberType name has changed, need to update
        //how the filters are displayed
        this.refreshFilters(this.form.fiberType)
      },
      'form.fiberType'(fiberType){
        //fiberType type has changed
         this.refreshVoltageSources(fiberType)
         this.refreshFilters(fiberType)
      },
    },
    computed: {
      feed(){
        return this.$store.getters.feed
      },
      ovens(){
        return this.$store.getters.ovens
      },
      wavelength:{
        get: function(){
          return this.tempToWl(this.form.ovens[this.filter].tset)
        },
        set: function(newWL){
          this.form.ovens[this.filter].tset = this.wlToTemp(newWL)
        }
      },
      choosefiberType(){
        if (this.form.fiberType == 'PMT'){
          return this.PMTNames
        }
        if(this.form.fiberType == 'PY'){
          return this.PYNames
        }
        return 0
      },
      status(){
        let returnObj ={
          alertText: "",
          oven:{
            ovenConnected: true,
            stateIcon: "",
            stateColorClass: "",
            text: "",
            tcrn: "",
            tset: "",
            wltarget: "",
            wlcrn: ""
          },
          HVfeed:{
            PMTvolts : 1,
            PYpivolts : 2,
            PYbg1volts : 3,
            PYsigmavolts : 4,
            PYbg2volts:5
          }
        }

        //No oven connected to fiberType
        let ovenName = ""
        if(this.form.fiberType == "PMT"){
          ovenName = this.form.fiberName
        } else if(this.form.fiberType == "PY"){
          let PYName = this.form.fiberName.split("_")[0] + "_" + this.form.fiberName.split("_")[1] + "_"
          ovenName = PYName + this.filter
        }
        if(this.ovens[ovenName]){

          //oven object exists, safe to access
          this.$set(returnObj.oven, 'state', this.ovens[ovenName].state)

          this.$set(returnObj.oven, 'tcrn', this.ovens[ovenName].tcrn)

          this.$set(returnObj.oven, 'wltarget', this.ovens[ovenName].wltarget)

          //this.$set(returnObj.oven, 'tset', this.ovens[this.form.fiberName].tset)

          this.$set(returnObj.oven, 'wlcrn', this.tempToWl(returnObj.oven.tcrn))

          if(this.form.ovens[this.filter].setactive){
            this.$set(returnObj.oven, 'stateIcon', 'mdi-check-circle')

            this.$set(returnObj.oven, 'stateColorClass', 'green--text')

            this.$set(returnObj.oven, 'text', 'Active')

          }else if (!this.form.ovens[this.filter].setactive){
            this.$set(returnObj.oven, 'stateIcon', 'mdi-close-circle')

            this.$set(returnObj.oven, 'stateColorClass', 'red--text')

            this.$set(returnObj.oven, 'text', 'Inactive')
          } else{
            //this.$set(returnObj.oven, 'ovenC>onnected', false)
          }
        }else{
          //this.$set(returnObj.oven, 'ovenConnected', false)
        }
        
        
        return returnObj
      }
    }
  }
</script>