import { StyleSheet,View,Text,TextInput,TouchableOpacity } from 'react-native';
import React,{useState,useEffect}  from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {app} from "../Firebase/firebase" ;
import { signInWithEmailAndPassword,getAuth } from 'firebase/auth';
import SignUp from './signup';
const Stackauth = createNativeStackNavigator();
const firebaseAuth = getAuth(app);


export default function SignIn ({navigation}) {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const signIn=(e)=>{
      e.preventDefault();
      signInWithEmailAndPassword(firebaseAuth,email,password).then((userCredential)=>{
       // console.log(userCredential);
        console.log(userCredential.user);
      }).catch((error)=>{
        console.log(error)
      });
    };
    const openSignup=()=>{
      navigation.navigate('SignUp');
    };
/**<NavigationContainer><Stack.Navigator initialRouteName="Home">
    <Stackauth.Screen name="Home" component={HomeScreen3} />
    <Stackauth.Screen name="ConfirmFare" component={ConfirmFareScreen} />
  </Stackauth.Navigator></NavigationContainer> */
return (
  
<View style={styles.container}>
  <Text style={styles.logo}>RideVibe</Text>
  <View style={styles.inputView} >
    <TextInput  
    autoCapitalize="none"
      style={styles.inputText}
      placeholder="Email..." 
      placeholderTextColor="#003f5c"
      onChangeText={text =>setEmail(text)}/>
  </View>
  <View style={styles.inputView} >
    <TextInput  
    autoCapitalize="none"
      secureTextEntry
      style={styles.inputText}
      placeholder="Password..." 
      placeholderTextColor="#003f5c"
      onChangeText={text => setPassword(text)}/>
  </View>
  <TouchableOpacity>
    <Text style={styles.forgot}>Forgot Password?</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.loginBtn}>
    <Text style={styles.loginText}  onPress={signIn}>LOGIN</Text>
  </TouchableOpacity>
  <TouchableOpacity>
    <Text style={styles.loginText} onPress={ openSignup}>Signup</Text>
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