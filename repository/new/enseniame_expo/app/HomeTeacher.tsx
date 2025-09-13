import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function HomeTeacher() {
  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenido Profesor!</Text>
          <Text style={styles.subtitle}>Panel de gestión de clases</Text>

          <Pressable style={styles.button}>
            <Ionicons name="people-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Mis Alumnos</Text>
          </Pressable>

          <Pressable style={styles.button}>
            <Ionicons name="create-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Crear Clase</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    backgroundColor: "#7209B7"
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minWidth: "80%"
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: 'center',
    height: 400
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: "#475569",
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F72585',
    borderRadius: 10,
    height: 50,
    minWidth: "60%",
    justifyContent: 'center',
    margin: 10,
    paddingHorizontal: 20,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
  },
});
