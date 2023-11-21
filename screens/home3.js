import React, { useState, useEffect, useRef } from "react";
import {Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,Button
} from "react-native";
import BottomSheet from 'react-native-simple-bottom-sheet';
import MapView, { Marker } from "react-native-maps";
import GetLocation from "react-native-get-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SafeAreaView } from "react-native";
import axios from "axios";
import ConfirmFareScreen from "./confirmfare";
import MapViewDirections from "react-native-maps-directions";
const { height } = Dimensions.get("window");
import {app} from '../Firebase/firebase' ;
import { getFirestore ,doc,updateDoc} from 'firebase/firestore';
import { onAuthStateChanged ,getAuth} from 'firebase/auth';
const db = getFirestore(app);
const auth = getAuth(app);


async function getpassenger(db,la,Des,passengerId,desname) {
//const passengerCol = collection(db, 'passenger');
const passengerref = doc(db, "passenger", passengerId);
console.log("doc ",passengerref);
console.log(la,Des);
await updateDoc(passengerref, {
  "passengerorigin": la,
  "passengerdestination":Des,
  "desname":desname,
});
}

//getpassenger(db);
const HomeScreen3 = ({navigation}) => {
  const mapRef = useRef(null);
  const [passengerId,setPassengerId]=useState("");
  const [Lat, setLat] = useState('');
  const [Lon, setLon] = useState('');
  const [Des, setDes] = useState('');
  const [timetarvel, setTimeTravel] = useState('');
  const[dlat,setDlat]=useState(37.7775126665005);
  const[dlon,setDlon]=useState(-122.40830213699655);
  const [isModalVisible, setModalVisible] = useState(false);
  const [desName,setDesname]=useState("");
  const [distFare, setDistFare] = useState(0);
  const[ind,setInd]=useState(0);
const [fi,setFi]=useState(0);
const translateY = useRef(new Animated.Value(height)).current;


const increment = () => {
  console.log("increment");
  setDistFare(distFare + 1);
  console.log(distFare);
  console.log(fi);
if (distFare==fi){
setInd(1);
toggleModal();



}
};

  const a = (la,d) => {
    axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${la}&destination=${Des}&key=${'AIzaSyCiMacRMgL81D1nU7_wjOLy-cKcSd_2zuQ'}&mode=driving`)
      .then((res) => {
        console.log("current loc ", la);
        console.log("directions ", res.data);
        const distanceText = res.data.routes[0].legs[0].distance.text;
        const distanceValue = parseFloat(distanceText);
        console.log("distance ", distanceValue);
        setDistFare(distanceValue);

        console.log("dist state ", distFare);
        setFi(distanceValue+1);
        console.log("time ", res.data.routes[0].legs[0].duration);
        console.log("time ", res.data.routes[0].legs[0].duration.text);
        setTimeTravel(res.data.routes[0].legs[0].duration.text);
        console.log("timetravel text ",timetarvel);
        getpassenger(db,la,Des,passengerId,d);
        //return res.data.routes[0].legs[0].duration.text;
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (!isModalVisible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: height,
        useNativeDriver: true,
      }).start();
    }
  };
 

  const handleMapReady = () => {
    if (mapRef.current && Lat && Lon) {
      mapRef.current.animateToRegion({
        latitude: Lat,
        longitude: Lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth,(user)=>{
      if (user){
        console.log("Authstate true",user['uid']);
       // console.log(Authstate);
        setPassengerId(user['uid']);
      }
      else{
        console.log("Authstate false ",user);
      }
    })


    const getloc = async () => {
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 3000,
        });
        console.log("current loc ", location);
        console.log(location.latitude, location.longitude);
        setLat(location.latitude);
        setLon(location.longitude);
        console.log("state changed ", Lat);
      } catch (error) {
        console.error("Error ", error);
      }
    };
    getloc();

console.log("dist fare in effect before nav", distFare);
console.log("time travel in effect before nav", timetarvel);
   if( distFare !== 0 && timetarvel!=""){
     navigation.navigate('ConfirmFare',{Lat,Lon,dlat,dlon,Des,timetarvel,distFare,desName,passengerId})
    
   }


    toggleModal();
  }, [distFare,timetarvel]);
  //if (ind==0){
  return ( 
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        provider={MapView.PROVIDER_GOOGLE}
        style={{ flex: 3 }}
        showsUserLocation={true}
        initialRegion={{
          latitude: Lat,
          longitude: Lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        zoomEnabled={true}
        followUserLocation={true}
        onMapReady={handleMapReady}
      >
        <Marker
          coordinate={{
            latitude: Lat,
            longitude: Lon,
          }}
        />
      </MapView>
      <TouchableOpacity onPress={toggleModal} style={styles.button}>
        <Text>Enter Destination</Text>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.sheetContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
          <SafeAreaView>
            <GooglePlacesAutocomplete
              placeholder="Destination"
              onPress={(data, details = null) => {
                console.log("Data ", data),
                console.log("Details ", details['geometry']['location']['lat'], details['geometry']['location']['lng']),
                setDes(details['geometry']['location']['lat'] + "," + details['geometry']['location']['lng']),
                console.log("After press ", Des),
                 l = Lat + "," + Lon;
                 setDesname(data['description']);
                setTimeTravel(a(l,data['description']));
              }}
              query={{
                key: "AIzaSyCiMacRMgL81D1nU7_wjOLy-cKcSd_2zuQ",
              }}
              fetchDetails={true}
              onFail={(error) => console.log(error)}
              onNotFound={() => console.log("no results")}
              currentLocationLabel="Your location!"
              styles={{
                container: {
                  flex: 1,
                  width: 300,
                  marginTop: 20,
                },
                description: {
                  color: "#000",
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: "#3caf50",
                },
              }}
            />
             



            
          </SafeAreaView>
        </View>
      </Animated.View>
    </View>
  );//}





/** 
  else{
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          provider={MapView.PROVIDER_GOOGLE}
          style={{ flex: 3 }}
          showsUserLocation={true}
          initialRegion={{
            latitude: Lat,
            longitude: Lon,
            latitudeDelta: 0.092,
            longitudeDelta: 0.042,
          }}
          zoomEnabled={true}
          followUserLocation={true}
          onMapReady={handleMapReady}
        >
           <MapViewDirections
          origin={{ latitude: Lat, longitude: Lon }}
          destination={{ latitude: dlat, longitude: dlon }}
          apikey={'AIzaSyCiMacRMgL81D1nU7_wjOLy-cKcSd_2zuQ'}
          strokeWidth={3}
          strokeColor="#023020"
        />
          <Marker
            coordinate={{
              latitude: Lat,
              longitude: Lon,
              latitudeDelta: 0.092,
            longitudeDelta: 0.042,
            }}
            title="Passenger"
          />
          <Marker
            coordinate={{
              latitude: dlat,
              longitude: dlon,
            }}
            title="Driver"
          >
           <Image 
    src="/Users/farazuddinhamzamir/Desktop/car.png"
    style={styles.markerImage}
  /></Marker>
        </MapView>
      
        <BottomSheet isOpen style={styles.bottomSheet}>
  <View style={styles.main}>
  <View>
              <Text style={styles.mainheading}>{desName}</Text>
            </View>
            <View style={styles.location}>
              <Text style={styles.locationicons}>🕜 5 min Trip</Text>
              <Text style={styles.locationicons}>🚗 {distFare} mi Away</Text>
            </View>
            <View style={styles.booking}>
                
            </View>
          </View>
      </BottomSheet>
      </View>
    );
  } **/

};










const styles = StyleSheet.create({
  titleText2: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  titleText: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  map: {
    flex: 3,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 10,
  },
  button: {
    position: "absolute",
    bottom: 50,
    right: 16,
    backgroundColor: "#00FF00",
    padding: 16,
    borderRadius: 8,
  },
  markerImage: {
    width: 50,
    height: 50
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
  },
  modalButton: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00FF00",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: height / 1.3, // Adjust the height as needed
  },
  sheetContent: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginTop: 0,
  },











  buttonfare: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
    titleText2: {
      flex: 4,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
    titleText: {
      flex: 2,
      justifyContent: "center",
      alignItems: "center",
      fontSize: 20,
      fontWeight: "bold",
    },
    map: {
      flex: 3,
    },
    modal: {
      justifyContent: "flex-end",
      margin: 10,
    },
    button: {
      position: "absolute",
      bottom: 50,
      right: 16,
      backgroundColor: "#00FF00",
      padding: 16,
      borderRadius: 8,
    },
    markerImage: {
      width: 55,
      height: 55
    },
    modalContent: {
      backgroundColor: "white",
      padding: 16,
      borderRadius: 8,
    },
    modalButton: {
      backgroundColor: "blue",
      padding: 12,
      borderRadius: 8,
      marginTop: 10,
      alignItems: "center",
    },
    bottomSheet: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "#00FF00",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16, // Adjust the height as needed
    },
    sheetContent: {
      flex: 3,
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      padding: 12,
      borderRadius: 8,
      marginTop: 0,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
      },


      main :{
        
        bottom: 10,
        backgroundColor: "#00FF00",
        width: "100%" ,
        height: "100%" ,
        borderRadius : 8 ,
        padding: 1
      },
      
      mainheading : {
        fontSize: 20,
        fontWeight: "bold",
        color: "#161616"
      },
      
      booking: {
        display: "flex",
        flex: "row" ,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
      },
      location:{
        flexDirection:"row",
        alignSelf:"center"
      },

      locationicons: {
        marginLeft: 10,
        marginRight: 20,
      },
      
      party: {
        display: "flex",
        flex: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#00FF00",
        borderRadius: "30px",
        width: 10,
        padding: 10,
        marginRight: 20,
      },
      
      partybtn :{
        backgroundColor: "#95B7DD",
        padding: 5,
        borderRadius: 5,
      },
});

export default HomeScreen3;
