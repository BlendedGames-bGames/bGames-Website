<template>
  <div>
    <title-bar :title-stack="titleStack" />
    <hero-bar :has-right-visible="false">
      Contribucion de sensores y puntos de datos
    </hero-bar>
    <section class="section is-main-section">
          <card-component
          >                              

                <div class="columns is-flex">

                    <div class="column is-3">     
                        <select-component label="Sensor" 
                                        placeholder="Seleciona un sensor"  
                                        :selectOptions="name_sensors" 
                                        @selected-option-click="circleChartQuerySensor"
                      /> 
                     
                      <select-component label="Dimension" 
                                        placeholder="Seleciona un sensor"
                                        :selectOptions="name_sensors" 
                                        @selected-field-click="chosen_sensor"
                                        @selected-option-click="circleChartQuerySensorAndEndpoint"
                      >
                          <b-field  vertical
                                    label="Subatributo" style="margin-bottom: 1em">
                            <b-select
                                v-model="selectedOption"
                                placeholder="Selecciona un punto de datos en particular"
                                @input="selectedOptionClick"
                                required
                              >
                                <option
                                  v-for="(option, index) in endpoints"
                                  :key="index"
                                  :value="option"
                                >
                                  {{ option }}
                                </option>
                            </b-select>  
                          </b-field>
                      </select-component>


                             
                    </div>
                    <div class="column is-9">
                        <card-component
                          :title="chartTitle"
                          icon="finance"
                        >
                          <svg width="960" height="960"></svg>

          
                       </card-component>

                    </div>
                </div>

          </card-component>
    </section>
   

  </div>
</template>

<script>
// @ is an alias to /src
import * as d3 from 'd3'
import TitleBar from '@/components/TitleBar'
import HeroBar from '@/components/HeroBar'
import CardComponent from '@/components/CardComponent'
import SelectComponent from '../components/SelectComponent.vue'
import {baseURL, getPort} from '../store/urls'
import { mapGetters } from 'vuex'
import Axios from 'axios'

export default {
  name: 'SensorContribution',
  components: {   
    CardComponent,
    HeroBar,
    TitleBar,
    SelectComponent
  },
  data () {
    return {
      selectedOption: null,
      circleChartShow:false,
      getURL:baseURL+getPort,
      chosen_sensor_option: null,
      chosen_endpoint_option: null,
      chosen_endpoint_name:'',
      chartTitle:'',

      endpoints: ['Business Development', 'Marketing', 'Sales'],
      departments: ['Business Development', 'Marketing', 'Sales'],
      jsonData:{"name":"variants","children":[{"name":"2","children":[{"name":"p23.3","children":[{"name":"IFT172","children":[{"name":"undefined","size":28},{"name":"aaaacxi7gjs3gascvqjaabaaaq","size":3},{"name":"aaaacxi7gjs3eascvqjaabaaci","size":6},{"name":"aaaacxi7gjs3gascvqjaabaabe","size":6},{"name":"aaaacxi7gjs3gascvqjaabaacm","size":1},{"name":"aaaacxi7gjs3eascvqjaabaaca","size":8},{"name":"aaaacxi7gjs3gascvqjaabaace","size":7},{"name":"aaaacxi7gjs3eascvqjaabaab4","size":5},{"name":"aaaacxi7gjs3gascvqjaabaaae","size":3},{"name":"aaaacxi7gjs3eascvqjaabaace","size":9},{"name":"aaaacxi7gjs3eascvqjaabaacq","size":9},{"name":"aaaacxi7gjs3gascvqjaabaaa4","size":4},{"name":"aaaacxi7gjs3eascvqjaabaaau","size":13},{"name":"aaaacxi7gjs3gascvqjaabaaay","size":5},{"name":"aaaacxi7gjs3eascvqjaabaaby","size":6},{"name":"aaaacxi7gjs3eascvqjaabaabq","size":5},{"name":"aaaacxi7gjs3gascvqjaabaaam","size":6},{"name":"aaaacxi7gjs3iascvqjaabaaaq","size":6},{"name":"aaaacxi7gjs3eascvqjaabaabi","size":5},{"name":"aaaacxi7gjs3iascvqjaabaaae","size":3},{"name":"aaaacxi7gjs3gascvqjaabaacu","size":2},{"name":"aaaacxi7gjs3eascvqjaabaabm","size":3},{"name":"aaaacxi7gjs3gascvqjaabaabu","size":3},{"name":"aaaacxi7gjs3iascvqjaabaaai","size":7},{"name":"aaaacxi7gjs3gascvqjaabaac4","size":3},{"name":"aaaacxi7gjs3gascvqjaabaabq","size":4},{"name":"aaaacxi7gjs3eascvqjaabaaay","size":6},{"name":"aaaacxi7gjs3gascvqjaabaabm","size":2},{"name":"aaaacxi7gjs3iascvqjaabaaa4","size":5},{"name":"aaaacxi7gjs3iascvqjaabaaau","size":7},{"name":"aaaacxi7gjs3gascvqjaabaabi","size":5},{"name":"aaaacxi7gjs3iascvqjaabaaba","size":12},{"name":"aaaacxi7gjs3iascvqjaabaaay","size":4},{"name":"aaaacxi7gjs3gascvqjaabaaca","size":6},{"name":"aaaacxi7gjs3gascvqjaabaacq","size":4},{"name":"aaaacxi7gjs3eascvqjaabaaa4","size":4},{"name":"aaaacxi7gjs3iascvqjaabaabi","size":5},{"name":"aaaacxi7gjs3iascvqjaabaabe","size":1},{"name":"aaaacxi7gjs3gascvqjaabaaci","size":4},{"name":"aaaacxi7gjs3gascvqjaabaaai","size":4},{"name":"aaaacxi7gjs3gascvqjaabaaba","size":2},{"name":"aaaacxi7gjs3gascvqjaabaada","size":1},{"name":"aaaacxi7gjs3eascvqjaabaabe","size":2},{"name":"aaaacxi7gjs3eascvqjaabaacm","size":5},{"name":"aaaacxi7gjs3gascvqjaabaaau","size":2},{"name":"aaaacxi7gjs3iascvqjaabaaam","size":1},{"name":"aaaacxi7gjs3eascvqjaabaaba","size":1},{"name":"aaaacxi7gjs3gascvqjaabaab4","size":3}]}]}]},{"name":"3","children":[{"name":"p21.31","children":[{"name":"CACNA2D2","children":[{"name":"aaaacxi7gjufoascvqjaabaafi","size":2},{"name":"undefined","size":1},{"name":"aaaacxi7gjufqascvqjaabaaae","size":2},{"name":"aaaacxi7gjufqascvqjaabaadu","size":1},{"name":"aaaacxi7gjufqascvqjaabaaee","size":2},{"name":"aaaacxi7gjufqascvqjaabaace","size":1},{"name":"aaaacxi7gjufqascvqjaabaaca","size":2},{"name":"aaaacxi7gjufqascvqjaabaad4","size":2}]},{"name":"LARS2","children":[{"name":"aaaacxi7gj6pmascvqjaabaag4","size":30},{"name":"aaaacxi7gj6pmascvqjaabaagy","size":9},{"name":"aaaacxi7gj6pmascvqjaabaaga","size":16},{"name":"aaaacxi7gj6pmascvqjaabaagq","size":8},{"name":"aaaacxi7gj6pmascvqjaabaahi","size":11},{"name":"aaaacxi7gj6pmascvqjaabaagm","size":14},{"name":"aaaacxi7gj6pmascvqjaabaage","size":1},{"name":"undefined","size":10},{"name":"aaaacxi7gj6pmascvqjaabaaia","size":12},{"name":"aaaacxi7gj6pmascvqjaabaahy","size":15},{"name":"aaaacxi7gj6pmascvqjaabaafq","size":8},{"name":"aaaacxi7gj6pmascvqjaabaaha","size":10},{"name":"aaaacxi7gj6pmascvqjaabaagu","size":12},{"name":"aaaacxi7gj6pmascvqjaabaaf4","size":10},{"name":"aaaacxi7gj6pmascvqjaabaahq","size":10}]}]}]},{"name":"7","children":[{"name":"q22.1","children":[{"name":"TFR2","children":[{"name":"aaaacxi7gjz4wascvqjaabaadq","size":2},{"name":"aaaacxi7gjz4yascvqjaabaaaq","size":1},{"name":"undefined","size":24},{"name":"aaaacxi7gjz4wascvqjaabaacq","size":4},{"name":"aaaacxi7gjz4yascvqjaabaaay","size":1},{"name":"aaaacxi7gjz4wascvqjaabaadm","size":1},{"name":"aaaacxi7gjz4wascvqjaabaacy","size":2},{"name":"aaaacxi7gjz4yascvqjaabaabi","size":2},{"name":"aaaacxi7gjz4yascvqjaabaaau","size":6}]}]}]},{"name":"9","children":[{"name":"q22.2","children":[{"name":"SECISBP2","children":[{"name":"undefined","size":30},{"name":"aaaacxi7gkabkascvqjaabaaea","size":9},{"name":"aaaacxi7gkabkascvqjaabaae4","size":6},{"name":"aaaacxi7gkabkascvqjaabaaf4","size":6},{"name":"aaaacxi7gkabkascvqjaabaaey","size":7},{"name":"aaaacxi7gkabkascvqjaabaafq","size":10}]}]}]},{"name":"12","children":[{"name":"q15","children":[{"name":"NUP107","children":[{"name":"undefined","size":16},{"name":"aaaacxi7gj74sascvqjaabaaby","size":10},{"name":"aaaacxi7gj74sascvqjaabaade","size":7},{"name":"aaaacxi7gj74sascvqjaabaadq","size":9},{"name":"aaaacxi7gj74sascvqjaabaab4","size":7},{"name":"aaaacxi7gj74sascvqjaabaacu","size":9},{"name":"aaaacxi7gj74sascvqjaabaaem","size":7},{"name":"aaaacxi7gj74sascvqjaabaaa4","size":3},{"name":"aaaacxi7gj74sascvqjaabaace","size":8},{"name":"aaaacxi7gj74sascvqjaabaaee","size":7},{"name":"aaaacxi7gj74sascvqjaabaady","size":3},{"name":"aaaacxi7gj74sascvqjaabaabq","size":6},{"name":"aaaacxi7gj74sascvqjaabaaca","size":8},{"name":"aaaacxi7gj74sascvqjaabaabi","size":10},{"name":"aaaacxi7gj74sascvqjaabaabm","size":5},{"name":"aaaacxi7gj74sascvqjaabaacy","size":4},{"name":"aaaacxi7gj74sascvqjaabaada","size":10},{"name":"aaaacxi7gj74sascvqjaabaac4","size":6},{"name":"aaaacxi7gj74sascvqjaabaabu","size":9},{"name":"aaaacxi7gj74sascvqjaabaacm","size":7},{"name":"aaaacxi7gj74sascvqjaabaacq","size":3},{"name":"aaaacxi7gj74sascvqjaabaadu","size":3},{"name":"aaaacxi7gj74sascvqjaabaad4","size":1},{"name":"aaaacxi7gj74sascvqjaabaadi","size":4}]}]}]},{"name":"17","children":[{"name":"p13.1","children":[{"name":"SCO1","children":[{"name":"aaaacxi7gjwlyascvqjaabaacu","size":25},{"name":"aaaacxi7gjwlyascvqjaabaace","size":39}]}]}]},{"name":"19","children":[{"name":"q13.2","children":[{"name":"SPINT2","children":[{"name":"aaaacxi7gjuvmascvqjaabaadm","size":1},{"name":"undefined","size":5},{"name":"aaaacxi7gjuvmascvqjaabaadi","size":3},{"name":"aaaacxi7gjuvmascvqjaabaade","size":6},{"name":"aaaacxi7gjuvmascvqjaabaac4","size":6},{"name":"aaaacxi7gjuvmascvqjaabaada","size":4},{"name":"aaaacxi7gjuvmascvqjaabaadu","size":2},{"name":"aaaacxi7gjuvmascvqjaabaadq","size":1}]}]},{"name":"p13.12","children":[{"name":"PRKACA","children":[{"name":"aaaacxi7gkb32ascvqjaabaagi","size":9}]}]}]},{"name":"22","children":[{"name":"q13.33","children":[{"name":"SCO2","children":[{"name":"undefined","size":32},{"name":"aaaacxi7gka5qascvqjaabaaai","size":35},{"name":"aaaacxi7gka5oascvqjaabaacq","size":7},{"name":"aaaacxi7gka5qascvqjaabaaay","size":21},{"name":"aaaacxi7gj4eqascvqjaabaab4","size":115},{"name":"aaaacxi7gka5oascvqjaabaacm","size":5}]}]}]}]}
    }
  },
  computed: {
    titleStack () {
      return ['Admin', 'Dashboard']
    },
     ...mapGetters('sensor', {
          sensorsAndEndpoints: 'sensorsAndEndpoints',
          name_sensors: 'name_sensors',
          id_sensors: 'id_sensors'
    }),
     ...mapGetters('user', {
          id_player: 'id_player'
    })
  },
  mounted () {
    //this.renderZoomableCircles()
  },
  methods: {
    renderZoomableCircles(data){
            var svg = d3.select("svg"),
                      margin = 20,
                      diameter = +svg.attr("width"),
                      g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

            var color = d3.scaleLinear()
                .domain([-1, 5])
                .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
                .interpolate(d3.interpolateHcl);

            var pack = d3.pack()
                .size([diameter - margin, diameter - margin])
                .padding(2);
            var root = d3.hierarchy(data)
                .sum(function(d) { return d.size; })
                .sort(function(a, b) { return b.value - a.value; });

            var focus = root,
                nodes = pack(root).descendants(),
                view;

            var circle = g.selectAll("circle")
              .data(nodes)
              .enter().append("circle")
                .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
                .style("fill", function(d) { return d.children ? color(d.depth) : null; })
                .on("click", function(event,d) { if (focus !== d) zoom(event,d), event.stopPropagation(); });

            var text = g.selectAll("text")
              .data(nodes)
              .enter().append("text")
                .attr("class", "label")
                .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
                .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
                .text(function(d) { return d.data.name; });

            var node = g.selectAll("circle,text");

            svg.style("background", 'white').on("click", function(event,d) { zoom(event,root); });

            zoomTo([root.x, root.y, root.r * 2 + margin]);

            function zoom(event,d) {
                  var focus0 = focus; focus = d;
                  console.log(event)
                  console.log(d)

                  var transition = d3.transition().duration(event.altKey ? 7500 : 750).tween("zoom", 
                      function(d) {
                        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                        return function(t) { zoomTo(i(t)); };
                      });

                  transition.selectAll("text")
                    .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                      .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                      .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                      .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
            }

            function zoomTo(v) {
              var k = diameter / v[2]; view = v;
              node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
              circle.attr("r", function(d) { return d.r * k; });
            }
    },

    searchOnArrayOption(arrayToSearch,attArray,option,attSingle){
      let result;
      console.log(arrayToSearch)
      console.log(attArray)
      console.log(option)
      console.log(attSingle)

      arrayToSearch.forEach((element) => {
        console.log(element,element[attArray])
        console.log(option)
          if(element[attArray] === option){           
            console.log('pase por aqui')    
            console.log(element[attSingle])    
            result = element[attSingle]             
          }
      });
      console.log(result)
      return result
    },

    async circleChartQuerySensor(option){

      if(!option) return
      
      var id_online_sensor = this.searchOnArrayOption(this.sensorsAndEndpoints,'name',option,'id_online_sensor')

      ///attributes/:id_attributes/sensor_contribution
      console.log(id_online_sensor)
      const MEDIUM_GET_URL = this.getURL+'/attributes/'+this.id_player.toString()+'/online_sensor/'+id_online_sensor.toString()
      const sensor_contribution = await Axios.get(MEDIUM_GET_URL);
      console.log(sensor_contribution)
      this.chartTitle = `Contribucion del sensor ${option} a las dimensiones y subatributos asociados `
      this.renderZoomableCircles(sensor_contribution.data)
      //this.jsonData=sensor_contribution.data
     
      //this.circleChartShow = true
      
    },
    async circleChartQuerySensorAndEndpoint(option){

      console.log(option)
      console.log(this.chosen_sensor_option)
      console.log(this.chosen_endpoint_option)

      if(!this.chosen_sensor_option || !this.chosen_endpoint_option) return
      // /subattributes/:id_player/online_sensor/:id_online_sensor/sensor_endpoint/:id_sensor_endpoint
      const MEDIUM_GET_URL = this.getURL+'/subattributes/'+this.id_player.toString()+'/online_sensor/'+this.chosen_sensor_option.toString()+'/sensor_endpoint/'+this.chosen_endpoint_option.toString()
      const sensor_contribution = await Axios.get(MEDIUM_GET_URL);
      console.log(sensor_contribution)
      this.chartTitle = `Contribucion del punto de datos ${this.chosen_endpoint_name} del sensor ${option} a los subatributos `
      this.renderZoomableCircles(sensor_contribution.data)
      //this.jsonData=sensor_contribution.data
      //this.circleChartShow = true
    },
    selectedOptionClick(){
      console.log(this.selectedOption)
      this.chosen_endpoint_name = this.selectedOption
      for (let index = 0; index < this.sensorsAndEndpoints.length; index++) {
        const sensor = this.sensorsAndEndpoints[index];
        this.chosen_endpoint_option = this.searchOnArrayOption(sensor.endpoints,'name',this.selectedOption,'id_sensor_endpoint')
        if(this.chosen_endpoint_option !== undefined){
          break
        }
      }
    },
    chosen_sensor(selected){
      console.log(selected)
      console.log(this.sensorsAndEndpoints)
      this.chosen_sensor_option = this.searchOnArrayOption(this.sensorsAndEndpoints,'name',selected,'id_online_sensor')
      console.log(this.chosen_sensor_option)

      let correspond_endpoints = this.searchOnArrayOption(this.sensorsAndEndpoints,'id_online_sensor',this.chosen_sensor_option,'endpoints')
      console.log(correspond_endpoints)

      let endpoint_names = []
      correspond_endpoints.forEach(endpoint => {
        endpoint_names.push(endpoint.name)
      });
      this.endpoints = endpoint_names
    }

  },
}
</script>
<style>
.node {
  cursor: pointer;
}

.node:hover {
  stroke: #000;
  stroke-width: 1.5px;
}

.node--leaf {
  fill: white;
}

.label {
  font: 11px "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
}

.label,
.node--root,
.node--leaf {
  pointer-events: none;
}

.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* aspect ratio */
  vertical-align: top;
  overflow: hidden;
}
.svg-content-responsive {
  display: inline-block;
  position: absolute;
  top: 10px;
  left: 0;
}
</style>