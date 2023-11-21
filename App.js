import React,{useState,useEffect}  from 'react';
import HomeScreen3 from './screens/home3' ;
import { StyleSheet,View,Text,TextInput,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConfirmFareScreen from './screens/confirmfare'
import SignIn from './screens/signin'
import SignUp from './screens/signup';
import { onAuthStateChanged ,getAuth} from 'firebase/auth';
import {app} from "./Firebase/firebase" ;
const Stack = createNativeStackNavigator();
const auth = getAuth(app);
export default function App () {
   const [Authstate,setAuthstate]=useState(null);
   const [signed,setSigned]=useState('false')
   const [phno,setPhno]=useState("");
   const [password,setPassword]=useState(""); 


  useEffect(()=>{
onAuthStateChanged(auth,(user)=>{
  if (user){
    console.log("Authstate true",user['uid']);
   // console.log(Authstate);
    setAuthstate(user);
    setSigned('true');
  }
  else{
    console.log("Authstate false ",user);
    setAuthstate(null);
    setSigned('false');
  }
})},[]);
 if(signed=='true'){
    return( 
      
    
    
    <NavigationContainer><Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen3}  />
    <Stack.Screen name="ConfirmFare" component={ConfirmFareScreen} />
  </Stack.Navigator></NavigationContainer>
      
    )
 }
  else{
return(<NavigationContainer><Stack.Navigator initialRouteName="SignIn">
<Stack.Screen name="SignIn" component={SignIn} />
<Stack.Screen name="SignUp" component={SignUp} />
</Stack.Navigator></NavigationContainer>
)
  }
};

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
});
