import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/TabBarBackground";
import { TabBarIcon } from "@/components/TabBarIcon";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { Platform, StyleSheet, View , Text, TouchableOpacity} from "react-native";
import { UserContext, useUserContext } from "@/context/UserContext";
import { UserContextProvider } from "@/context/UserContext";

export default function RootLayout() {
  const contexto = useUserContext()
  
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
          <TouchableOpacity onPress={() => {
            contexto.user.goHome()

          }} style={styles.navItem}>
            <Ionicons name="home" size={22} color="#fff" />
            <Text style={styles.navText}>Inicio</Text>
          </TouchableOpacity>
        ),
      })}
      />

      <Tabs.Screen name='Cursos'   options={({ navigation }) =>({title:"Cursos", 
        tabBarButton: ((props) => 
          <TouchableOpacity onPress={() => navigation.navigate('Cursos')}  style={styles.navItem}>
            <Ionicons name="book" size={22} color="#fff" />
            <Text style={styles.navText}>Cursos</Text>
          </TouchableOpacity>
        ),
      })}
      />
      {contexto.user.is_prof ? <Tabs.Screen name='video_upload_form'   options={({ navigation }) =>({title:"VideoUploadForm", 
          tabBarButton: ((props) => 
            <TouchableOpacity onPress={() => navigation.navigate('video_upload_form')}  style={styles.fabButton}>
              <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
          ),
        })}
        /> :
        <Tabs.Screen name="video_upload_form" options={{href:null}}/>
      }

      <Tabs.Screen name='Diccionario'   options={({ navigation }) =>({title:"Diccionario", 
        tabBarButton: ((props) => 
          <TouchableOpacity onPress={() => navigation.navigate('Diccionario')}  style={styles.navItem}>
            <Ionicons name="search" size={22} color="#fff" />
            <Text style={styles.navText}>Diccionario</Text>
          </TouchableOpacity>
        ),
      })}
      />

      <Tabs.Screen name='perfil'   options={({ navigation }) =>({title:"Perfil", 
        tabBarButton: ((props) => 
          <TouchableOpacity onPress={() => navigation.navigate('perfil')}  style={styles.navItem}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
            <Text style={styles.navText}>Perfil</Text>
          </TouchableOpacity>
        ),
      })}
      />

      <Tabs.Screen name="HomeStudent" options={{href:null,title:"Home"}}/>
      <Tabs.Screen name="HomeTeacher" options={{href:null,title:"Home"}}/>
      
    </Tabs>
    
    );
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
  fabButton: {
    position: 'absolute',
    left: '50%',
    bottom: 1,
    transform: [{ translateX: -32 }, { translateY: -20 }],
    backgroundColor: '#7209B7',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#f3e8ff',
    zIndex: 2,
  },
})