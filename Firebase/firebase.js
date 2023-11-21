import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";

import { initializeAuth, getReactNativePersistence  } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig={
    apiKey: "AIzaSyCIYA159VcKjlY6jhlupt51gzhYzqL7hcQ",
    authDomain: "ridevibe-ac881.firebaseapp.com",
    databaseURL: "https://ridevibe-ac881-default-rtdb.firebaseio.com",
    projectId: "ridevibe-ac881",
    storageBucket: "ridevibe-ac881.appspot.com",
    messagingSenderId: "142670251402",
    appId: "1:142670251402:web:135de77889051f76f4b473",
    measurementId: "G-0JXLGLZ05Q"
}



const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export default app;





/** 
if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
*/
//export {firebase}