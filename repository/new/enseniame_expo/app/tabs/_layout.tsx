import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/TabBarBackground";
import { TabBarIcon } from "@/components/TabBarIcon";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { Platform, StyleSheet, View , Text, TouchableOpacity} from "react-native";


export default function RootLayout() {
  return(
    <Tabs screenOptions={{
				tabBarStyle: styles.navBar,
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 70, 
        },
		}}>
      <Tabs.Screen name='index'  options={({ navigation }) =>({title:"Home",
        tabBarButton: ((props) => 
          <TouchableOpacity onPress={() => navigation.navigate('index')} style={styles.navItem}>
            <Ionicons name="home" size={22} color="#fff" />
            <Text style={styles.navText}>Inicio</Text>
          </TouchableOpacity>
        ),
      })}
      />

      <Tabs.Screen name='cursos'   options={({ navigation }) =>({title:"Home", 
        tabBarButton: ((props) => 
          <TouchableOpacity onPress={() => navigation.navigate('cursos')}  style={styles.navItem}>
            <Ionicons name="book" size={22} color="#fff" />
            <Text style={styles.navText}>Cursos</Text>
          </TouchableOpacity>
        ),
      })}
      />
    
    </Tabs>);
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#560bad',
    paddingVertical: 12,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70, // Ancho mínimo para cada elemento
    marginTop: 15
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
})