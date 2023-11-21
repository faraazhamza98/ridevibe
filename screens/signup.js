import { StyleSheet,View,Text,TextInput,TouchableOpacity } from 'react-native';
import React,{useState,useEffect}  from 'react';
import {app} from "../Firebase/firebase" ;
import { createUserWithEmailAndPassword ,getAuth} from 'firebase/auth';
import SignIn from './signin';
import { getFirestore ,doc,updateDoc,setDoc} from 'firebase/firestore';
const firebaseAuth = getAuth(app);
const db = getFirestore(app);
export default function SignUp ({navigation}) {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
const [passengerName,setPassengerName]=useState('');
    const signUp=(e)=>{
      e.preventDefault();
      console.log(email,password);
      createUserWithEmailAndPassword(firebaseAuth,email,password).then((userCredential)=>{
       // console.log(userCredential);
        console.log("userId ",userCredential['user']['uid']);
        const passengerref = doc(db, "passenger", userCredential['user']['uid']);
console.log("doc ",passengerref);
//console.log(la,Des);
setDoc(passengerref, {
  "driverId": 0,
  "name":passengerName,
  "passengerId":userCredential['user']['uid'],
  "passengerdestination":"",
  "passengerorigin":"",
  "fare":0,
  "triptime":"",
  "desname":"",
  "ridestatus":"notsearching"
});
      }).catch((error)=>{
        console.log(error)
      }); 
  /**     createUserAndSignInWithToken = onCall({cors: true}, async (request) => {

        var result = await createUserWithEmailAndPassword(firebaseAuth, email, password).then(async function(userCredential) {
      
          var customToken = await adminAuth.createCustomToken(userCredential.user.uid);
          return customToken;
    })}); */

}

return (
<View style={styles.container}>
  <Text style={styles.logo}>RideVibe</Text>
  <View style={styles.inputView} >
    <TextInput  
    value={email.value}
    autoCapitalize="none"
      style={styles.inputText}
      placeholder="email..." 
      placeholderTextColor="#003f5c"
      onChangeText={text =>setEmail(text)}
      keyboardType="email-address"
      error={!!email.error}
    errortext={email.error}/>
  </View>
  <View style={styles.inputView} >
    <TextInput  
    secureTextEntry
    value={password.value}
     autoCapitalize="none"
      style={styles.inputText}
      placeholder="password..." 
      placeholderTextColor="#003f5c"
      onChangeText={text => setPassword(text)}
      error={!!password.error}
    errortext={password.error}/>
  </View>
  <View style={styles.inputView} >
    <TextInput  
    value={passengerName.value}
    autoCapitalize="none"
      style={styles.inputText}
      placeholder="name.." 
      placeholderTextColor="#003f5c"
      onChangeText={text =>setPassengerName(text)}
      error={!!email.error}
    errortext={email.error}/>
  </View>
  <TouchableOpacity style={styles.loginBtn}>
    <Text style={styles.loginText}  onPress={signUp}>signup</Text>
  </TouchableOpacity>
</View> 
)}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
})