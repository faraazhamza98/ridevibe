import React, { useState, useEffect, useRef,useMemo,useCallback } from "react";
import {Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,Button,Pressable,
} from "react-native";
import BottomSheet from 'react-native-simple-bottom-sheet';
import { SafeAreaView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useRoute } from '@react-navigation/native'; 
import {app} from "../Firebase/firebase";
import { getFirestore ,doc,updateDoc} from 'firebase/firestore';
import { getAuth} from 'firebase/auth';
const db = getFirestore(app);
const auth = getAuth(app);


async function confirmride(passengerId,desname,timetravel,fare) {
//const passengerCol = collection(db, 'passenger');
const passengerref = doc(db, "passenger", passengerId);
console.log("doc ",passengerref);
await updateDoc(passengerref, {
  "ridestatus":"searching",
  "desname":desname,
  "triptime":timetravel,
  "fare":fare,
});
}



const ConfirmFareScreen = () => {

    const route = useRoute();
    const mapRef = useRef(null);
    const { height } = Dimensions.get("window");
  const [isModalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(height)).current;
    const handleMapReady = () => {
        if (mapRef.current && route.params.Lat && route.params.Lon) {
          mapRef.current.animateToRegion({
            latitude: route.params.Lat,
            longitude: route.params.Lon,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }
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


    return (<View style={{ flex: 1 }}><View style={{ flex: 0.85 }}>
    <MapView
      ref={mapRef}
      provider={MapView.PROVIDER_GOOGLE}
      style={{ flex: 3 }}
      showsUserLocation={true}
      initialRegion={{
        latitude: route.params.Lat,
        longitude: route.params.Lon,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      zoomEnabled={true}
      followUserLocation={true}
      onMapReady={handleMapReady}
    >
       <MapViewDirections
      origin={{ latitude: route.params.Lat, longitude: route.params.Lon }}
      destination={{ latitude: route.params.dlat, longitude: route.params.dlon }}
      apikey={'AIzaSyCiMacRMgL81D1nU7_wjOLy-cKcSd_2zuQ'}
      strokeWidth={3}
      strokeColor="#023020"
    />
      <Marker
        coordinate={{
          latitude: route.params.Lat,
          longitude: route.params.Lon,
          latitudeDelta: 0.092,
        longitudeDelta: 0.042,
        }}
        title="Passenger"
      />
     <Marker
        coordinate={{
          latitude: route.params.dlat,
          longitude: route.params.dlon,
        }}
        title="Driver"
      >
       <Image 
src="/Users/farazuddinhamzamir/Desktop/d.png"
style={styles.markerImage}
/></Marker>
      
    </MapView>
  
  
  </View>
  <BottomSheet isOpen style={styles.bottomSheet}>
  <View style={styles.main}>
  <View>
              <Text style={styles.mainheading}>{route.params.desName}</Text>
            </View>
            <View style={styles.location}>
              <Text style={styles.locationicons}>🕜 {route.params.timetarvel} Trip</Text>
              <Text style={styles.locationicons}>🚗 {route.params.distFare} mi</Text>
            </View>
            <View style={styles.booking}>
            <Pressable style={styles.buttonfare}  onPress={()=> confirmride(route.params.passengerId,route.params.desName,route.params.timetarvel,route.params.distFare)}>
      <Text style={styles.text}>Confirm Fare ${route.params.distFare}</Text>
    </Pressable>      
            </View>
          </View>
      </BottomSheet>
   
  </View>
);
}
/**
 * <Marker
        coordinate={{
          latitude: route.params.dlat,
          longitude: route.params.dlon,
        }}
        title="Driver"
      >
       <Image 
src="/Users/faraazhamza/Desktop/Ride/ridevibev2/ridevibe/car.png"
style={styles.markerImage}
/></Marker>


<BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
 */


const styles = StyleSheet.create({
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




export default ConfirmFareScreen;