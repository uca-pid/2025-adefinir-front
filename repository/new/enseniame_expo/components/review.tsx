import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";


function RatingStars (props: {puntaje:number, color:string}){
    return (
        <View style={{flexDirection:"row", marginVertical:15}}>
            <Ionicons name="star" size={24} color={props.color} />
            <Ionicons name={props.puntaje>=2 ? "star": "star-outline"} size={24} color={props.color}/>
            <Ionicons name={props.puntaje>=2 ? "star": "star-outline"} size={24} color={props.color} />
            <Ionicons name={props.puntaje>=2 ? "star": "star-outline"} size={24} color={props.color} />
            <Ionicons name={props.puntaje>=2 ? "star": "star-outline"} size={24} color={props.color} />
        </View>
    )
}

export {RatingStars}