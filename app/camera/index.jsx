import {useState, useRef} from 'react'
import {View, StyleSheet, Text, Image, Button} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'

export default function Camera() {
  const [permissao, pedirPermissao] = useCameraPermissions()
  const [foto, setFoto] = useState(null)
  const cameraRef = useRef(null)
  const [lado, setLado] = useState('back')

  const tirarFoto = async () => {
    const foto_base64 = await cameraRef.current?.takePictureAsync({
      quality: 0.5,
      base64: true
    })
    setFoto(foto_base64)
  }

  const trocaCamera = () => {
    setLado(lado == 'back' ? 'front' : 'back')
  }

  if (!permissao){
    return <View></View>
  }
  if (!permissao.granted){
      return(
        <View style={styles.container}>
          <Text style={styles.textoPermissao}>Você precisa pedir a permissão para usar a câmera</Text>
          <Button title='Pedir Permissão' onPress={pedirPermissao}/>
        </View>
      )
  }

  const salvarFoto = () => {
      MediaLibrary.saveToLibraryAsync(foto.uri)
      setFoto(null)
  }



  return (
    <View style={styles.container}>
    {foto ? 
      <View>
        <Image source={{uri: foto.uri}} style={styles.foto}></Image>
        <Button title='Descartar foto' onPress={() => setFoto(null)}/>
        <Button title='Salvar foto' onPress={salvarFoto}/>
      </View> :
    <CameraView facing={'back'} style={styles.camera} ref={cameraRef}>
      <Button title='Tirar foto' onPress={tirarFoto}/>
      <Button title='inverter camera' onPress={trocaCamera}/>
    </CameraView>
  }
  </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center'
  },
  textoPermissao:{
    textAlign: 'center'
  },
  camera:{
    flex: 1
  },
  foto:{
    width: '75%',
    height: '75%'
  }
})