import { TouchableOpacity , StyleSheet} from "react-native"
import { ThemedText } from "./ThemedText"


function BotonLogin (props:{callback: Function,textColor: string, bckColor: string, text: string}){
    return (
        <TouchableOpacity onPress={()=>props.callback()} style={[styles.loginButton,{backgroundColor:props.bckColor}]} >
            <ThemedText type="subtitle" lightColor={props.textColor}>{props.text}</ThemedText>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    loginButton: {
        borderRadius: 10,
        height: 50,
        minWidth: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
})

export {BotonLogin}