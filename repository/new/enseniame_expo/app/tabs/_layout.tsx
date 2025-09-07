import { TabBarIcon } from "@/components/TabBarIcon";
import { Stack, Tabs } from "expo-router";


export default function RootLayout() {
  return(
    <Tabs>
    <Tabs.Screen name='index' options={{title:"Home",headerShown:false, tabBarIcon: ({focused,color})=><TabBarIcon name={focused? "home" : "home-outline"} color={color}/>}}/>
    
    </Tabs>);
}
