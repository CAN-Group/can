import React, { Component } from 'react'
import ContentWrapper from '../ContentWrapper'
import styled from 'styled-components'
import InputMap from './InputMap'
import LeafletMap from './LeafletMap'
import AutoTextBox from '../../helpers/AutoTextBox';
import cities from './../../../assets/metadata/cities.json';
import MapComponent from './MapComponent';
import SubmitButton from '../../helpers/SubmitButton'
import ZoneSlider from './../../helpers/ZoneSlider'
import { getProfiles, getData, getGeoJson } from './../../helpers/js/apiCalls'
import PathBoxMap from './PathBoxMap';
import { FaFlag, FaFlagCheckered, FaCog  } from "react-icons/fa";
import SwitchButton from './../../helpers/SwitchButton';


//FaDirections 

import api from './../../helpers/js/connection';



const StyledMapPanel = styled.div`
    height: 600px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    
`;

const StyledDot = styled.div`;
    background-color: #2C363C;
    width: 6px;
    height: 6px;
    border-radius: 30px;
    position: absolute;
    top: 215px;
    left: 80px;
`



export default class Mappanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cityArray: [],
      citiesCollection: [],
      markerStart: { lat: 54.090912551535496, lng: 22.944773199664805 },
      markerStop: { lat: 53.730511521850424, lng: 22.70256041650225 },
      toggled: false,
      profiles: [],
      selectedProfile: "car-eco",
      excludeZones: [],
      countyInfo: new Map(),
      zoneThresshold: [30, 70],
      selectedCountyId: 0,
      geoJson: {},
      routedGpx: "",
      nonroutedGpx: "",
      renderTrigger: true,
      showNoRoute: true,
      distances: [0, 0],
      loadingRoute: false,
      loadingNRoute: false,
      errorRoute: "",
      errorNRoute: "",
      profilesName: [],
      safeRouteEnabled: true,
    };
  }

  opacity = 0.1;

  geoJsonStyle = {
    weight: 0.3,
    color: "black",
    fillColor: "gray",
    opacity: 0.5,
  };

  componentDidMount() {
    getData().then((countyInfoxd) => {
      const countyTemp = this.setZoneLevel(countyInfoxd);
      this.onZoneUpdate(countyTemp);
      this.setState({ countyInfo: countyTemp });
    });
    getGeoJson().then((geo) => this.setState({ geoJson: geo }));
    getProfiles().then((profiles) => {

       const temp = [];
       this.setState({ profiles: profiles });
       
       profiles.Profiles.forEach(prof => {
        temp.push(prof.name);
       })
       this.setState({profilesName: temp});

    });

    const cityArray = [];
    const citiesCollection = cities.map(({ city, lat, lng }) => ({
      city,
      lat,
      lng,
    }));
    citiesCollection.forEach((city) => {
      cityArray.push(city.city);
    });

    this.setState({ cityArray: cityArray, citiesCollection: citiesCollection });
  }

  setZoneLevel(countyInfo) {
    const tempMap = new Map(countyInfo);

    const { zoneThresshold } = this.state;

    let ratioLevel = [];

    countyInfo.forEach((value, key) => {
      let ratio =
        (parseInt(value.casesCount) / parseInt(value.population)) * 1000000;
      ratioLevel.push({ key, ratio });
    });

    ratioLevel.sort((a, b) => a.ratio - b.ratio);

    const lowThresshold = Math.floor(
      (zoneThresshold[0] / 100) * ratioLevel.length
    );
    const highThresshold = Math.floor(
      (zoneThresshold[1] / 100) * ratioLevel.length
    );

    let color;
    ratioLevel.forEach((county, index) => {
      if (index <= lowThresshold) {
        color = "green";
      } else if (index >= highThresshold) {
        color = "red";
      } else {
        color = "yellow";
      }

      tempMap.get(county.key).danger = color;
    });

    return tempMap;
  }

  onSelectedCity = (cityName, type) => {
    let lat = 0;
    let lng = 0;
    this.state.citiesCollection.forEach((cityObj) => {
      if (cityObj.city === cityName) {
        lat = cityObj.lat;
        lng = cityObj.lng;

        if (type === "MarkerA") {
          this.setState({ markerStart: { lat: lat, lng: lng } });
        } else {
          this.setState({ markerStop: { lat: lat, lng: lng } });
        }
      }
    });
  };

  onSelectedProfile = (value, type) => {
    this.state.profiles.Profiles.forEach( prof => {
      if(value === prof.name)
      {
        this.setState({ selectedProfile: prof.key});    
      }
    });
  };

  onSubmit = (e) => {
    const {
      markerStart,
      markerStop,
      selectedProfile,
      excludeZones,
    } = this.state;

    this.setState({
      loadingRoute: true,
      loadingNRoute: true,
      disances: [0, 0],
      errorRoute: "",
      errorNRoute: "",
    });

    if(this.state.safeRouteEnabled){
    const urlNoRoute = api.nonroute(
      {
        start: [markerStart.lng, markerStart.lat],
        end: [markerStop.lng, markerStop.lat],
      },
      selectedProfile
    );


    fetch(urlNoRoute)
      .then((res) => {
        if (!res.ok) {
          throw Error("No Path Found");
        }
        return res;
      })
      .then((res) => res.text())
      .then((data) => {
        this.setState({
          nonRoutedGpx: data,
          loadingNRoute: false,
        });
        console.log("success for nonroute!  " + url);
      })
      .catch((error) => {
        this.setState({errorNRoute: "No Path Found"});
      }).finally(()=>{
        this.setState({loadingNRoute: false});
      });
    }

    const url = api.route(
      {
        start: [markerStart.lng, markerStart.lat],
        end: [markerStop.lng, markerStop.lat],
      },
      excludeZones,
      selectedProfile
    );

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw Error("No Path Found");
        }
        return res;
      })
      .then((res) => res.text())
      .then((data) => {
        this.setState({ routedGpx: data});
        console.log("success!  " + url);
      }).catch(error => {
          this.setState({errorRoute: "No Path Found"});
      }).finally(() => {
          this.setState({loadingRoute: false});
      });
  };

  onZoneUpdate = (countyInfo) => {
    const excludedZones = [];
    countyInfo.forEach((county, id) => {
      if (county.danger === "red") {
        excludedZones.push(id);
      }
    });

    this.setState({ excludeZones: excludedZones });
  };

  onDragEnd = (position, type) => {
    if (type === "MarkerA") {
      this.setState({ markerStart: { lat: position.lat, lng: position.lng } });
    } else if (type === "MarkerB") {
      this.setState({ markerStop: { lat: position.lat, lng: position.lng } });
    }
  };

  onThumbMouseUp = (e) => {
    const { countyInfo } = this.state;
    const renderTrigger = !this.state.renderTrigger;
    const { id, value } = e.target;

    console.log(id + "->> " + value);

    if (id === "inputLeft")
      this.setState({ zoneThresshold: [value, this.state.zoneThresshold[1]] });
    else {
      this.setState({ zoneThresshold: [this.state.zoneThresshold[0], value] });
    }

    const newMap = this.setZoneLevel(countyInfo);
    this.onZoneUpdate(newMap);
    this.setState({ countyInfo: newMap, renderTrigger: renderTrigger });
  };

  onDistanceLoaded = (dist, id) => {
    const distance = (dist / 1000).toFixed(2);

    if (id === "red") {
      this.setState({ distances: [distance, this.state.distances[1]] });
    } else {
      this.setState({ distances: [this.state.distances[0], distance] });
    }
  };

  onChangeSwitch = e => {
      const prev = this.state.safeRouteEnabled;
      this.setState({safeRouteEnabled: !prev});
  }


  iconStyle = {
    fontSize: 24,
    marginRight: 7,
    color: "#2C363C",
    marginTop: 13,
  };

  render() {
    const {
      countyInfo,
      cityArray,
      profiles,
      zoneThresshold,
      routedGpx,
      nonRoutedGpx,
      markerStart,
      markerStop,
      renderTrigger,
    } = this.state;
    return (
      <ContentWrapper>
        <StyledMapPanel>
          <InputMap>
            <ZoneSlider
              onThumbMouseUp={this.onThumbMouseUp}
              zoneThresshold={zoneThresshold}
            />
            <AutoTextBox
              placeholder="Choose starting point..."
              items={cityArray}
              onSelection={this.onSelectedCity}
              type="MarkerA"
            >
              <FaFlag style={this.iconStyle} />
            </AutoTextBox>
            <StyledDot />
            <StyledDot style={{ top: 225 }} />
            <AutoTextBox
              placeholder="Choose destination..."
              items={cityArray}
              onSelection={this.onSelectedCity}
              type="MarkerB"
            >
              <FaFlagCheckered style={this.iconStyle} />
            </AutoTextBox>
            <AutoTextBox
              placeholder="Choose routing profile..."
              items={this.state.profilesName}
              onSelection={this.onSelectedProfile}
            >
              <FaCog style={this.iconStyle} />
            </AutoTextBox>
        
            <SubmitButton
              handleClick={this.onSubmit}
              loading={[this.state.loadingRoute, this.state.loadingNRoute]}
            />
          </InputMap>

          <LeafletMap
            markerStart={markerStart}
            markerStop={markerStop}
            onDragEnd={this.onDragEnd}
            countyInfo={countyInfo}
            renderTrigger={renderTrigger}
          >
            <MapComponent
              gpx={routedGpx}
              pathColor="blue"
              onDistanceLoaded={this.onDistanceLoaded}
            />
            {this.state.showNoRoute && (
              <MapComponent
                gpx={nonRoutedGpx}
                pathColor="red"
                onDistanceLoaded={this.onDistanceLoaded}
              />
            )}
            {(this.state.loadingRoute ||
              this.state.loadingNRoute ||
              this.state.distances.some((num) => num !== 0)) && (
              <PathBoxMap
                distanceRoutes={this.state.distances}
                loading={[this.state.loadingRoute, this.state.loadingNRoute]}
                error={[this.state.errorNRoute,this.state.errorRoute]}
              />
            )}
          </LeafletMap>
        </StyledMapPanel>
      </ContentWrapper>
    );
  }
}