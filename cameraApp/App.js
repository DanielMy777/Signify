import React, { useState, useEffect, useMemo, useRef,useCallback } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import SignifyCamera from './components/SignifyCamera';



const App = () => {
   const [handsDetected,setHandsDetected] = useState(false);
   const onDetection = useCallback((res) =>{
     setHandsDetected(res.hands.handsRect.detected);
   },[]);
   return <View style = {styles.container} >
    <SignifyCamera onDetection={onDetection} style={styles.camera} frameProcessorFps={10}
     frameMaxSize={220} frameQuality={20}/>
    {!handsDetected && <Text style={styles.myText}>No Hands</Text>}
    </View>

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myText:
  {
    position:'absolute',
    bottom:'5%',
    textAlign:'center',
    width:'100%',
    fontSize:45
  },
  camera:
  {
    position: 'absolute',
    top: '0%',
    left: '0%',
    width: '100%',
    height: '100%',
  },
  
});

export default App;
