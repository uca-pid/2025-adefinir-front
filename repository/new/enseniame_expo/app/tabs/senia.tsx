import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import VideoPlayer from "@/components/VideoPlayer";
import { supabase } from "../../utils/supabase";

export default function SeniaScreen() {
  const { id, nombre, video_url, modulo_id } = useLocalSearchParams<{ id: string, nombre?: string, video_url?: string, modulo_id?: string }>();
  const router = useRouter();
  const [senia, setSenia] = useState<{ nombre: string; video_url: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nombre && video_url) {
      setSenia({ nombre: String(nombre), video_url: String(video_url) });
    } else if (id) {
      const fetchSenia = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('Senias')
            .select('significado, video_url')
            .eq('id', id)
            .single();
          if (data) setSenia({ nombre: data.significado, video_url: data.video_url });
        } finally {
          setLoading(false);
        }
      };
      fetchSenia();
    }
  }, [id, nombre, video_url]);

  if (loading || !senia) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#20bfa9" />
      </View>
    );
  }

  const hasVideo = !!senia.video_url && senia.video_url !== 'undefined' && senia.video_url !== '';

  return (
    <View style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => {
        if (modulo_id) {
          router.replace({ pathname: '/tabs/detalle_modulo', params: { id: modulo_id } });
        } else {
          router.back();
        }
      }}>
        <Text style={styles.backBtnText}>← Volver</Text>
      </Pressable>
      <Text style={styles.title}>{senia.nombre}</Text>
      <Text style={styles.description}>ID: {id}</Text>
      {hasVideo ? (
        <VideoPlayer uri={senia.video_url} style={{ marginVertical: 20, width: 320, height: 180 }} />
      ) : (
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text style={styles.description}>No hay video para esta seña.</Text>
          <Pressable
            style={{ backgroundColor: '#20bfa9', borderRadius: 10, padding: 12, marginTop: 12 }}
            onPress={() => router.push({ pathname: '/tabs/video_upload_form', params: { senia_id: id, modulo_id } })}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Subir video</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#20bfa9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#20bfa9",
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
