import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useHewanViewModel } from '@/hooks/useHewanViewModel';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddHewanScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;

  const [nama, setNama] = useState('');
  const [jenis, setJenis] = useState('');
  const [harga, setHarga] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [status, setStatus] = useState<'tersedia' | 'terjual'>('tersedia');
  const [showDropdown, setShowDropdown] = useState(false);

  const { addHewan, updateHewan, fetchHewanById, loading, error } = useHewanViewModel();
  const router = useRouter();

  useEffect(() => {
    if (isEditMode && id) {
      const loadHewan = async () => {
        const data = await fetchHewanById(Number(id));
        if (data) {
          setNama(data.nama);
          setJenis(data.jenis);
          setHarga(String(data.harga));
          if (data.tanggal_lahir) {
            setTanggalLahir(new Date(data.tanggal_lahir));
          }
          if (data.status) {
            setStatus(data.status);
          }
        }
      };
      loadHewan();
    }
  }, [id, isEditMode]);

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTanggalLahir(selectedDate);
    }
  };

  const handleBack = () => {
    const hasData = nama.trim() || jenis.trim() || harga.trim();
    if (hasData) {
      Alert.alert(
        'Batalkan Pengisian?',
        'Data yang sudah diisi akan hilang. Yakin ingin kembali?',
        [
          { text: 'Tetap di Sini', style: 'cancel' },
          { text: 'Ya, Kembali', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const onSubmit = () => {
    const cleanNama = nama.trim();
    const cleanJenis = jenis.trim();
    const numericHarga = Number(harga);

    if (!cleanNama) {
      Alert.alert('Validasi Gagal', 'Nama hewan wajib diisi');
      return;
    }

    if (!cleanJenis) {
      Alert.alert('Validasi Gagal', 'Jenis hewan wajib diisi');
      return;
    }

    if (!harga || isNaN(numericHarga) || numericHarga <= 0) {
      Alert.alert('Validasi Gagal', 'Harga harus berupa angka lebih besar dari 0');
      return;
    }

    addHewan({
      nama: cleanNama,
      jenis: cleanJenis,
      harga: numericHarga,
      tanggal_lahir: formatDateString(tanggalLahir),
      status: status
    }, () => {
      router.back();
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <ThemedView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ThemedText style={styles.backButtonText}>← Kembali</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title">Tambah Ternak Baru</ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

          <TextInput
            style={styles.input}
            placeholder="Nama Hewan"
            placeholderTextColor="#94a3b8"
            value={nama}
            onChangeText={setNama}
          />

          <TextInput
            style={styles.input}
            placeholder="Jenis (contoh: Sapi Limosin)"
            placeholderTextColor="#94a3b8"
            value={jenis}
            onChangeText={setJenis}
          />

          <TextInput
            style={styles.input}
            placeholder="Harga (Rupiah)"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            value={harga}
            onChangeText={(text) => {
              setHarga(text.replace(/[^0-9]/g, ''));
            }}
          />

          <TouchableOpacity
            style={styles.dateInputButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.dateText}>
              Tanggal Lahir: {formatDateString(tanggalLahir)}
            </ThemedText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={tanggalLahir}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
              maximumDate={new Date()}
            />
          )}

          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.dropdownButtonText}>
              Status: {status === 'tersedia' ? 'Tersedia' : 'Terjual'}
            </ThemedText>
            <ThemedText style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</ThemedText>
          </TouchableOpacity>

          {showDropdown && (
            <ThemedView style={styles.dropdownMenu}>
              <TouchableOpacity
                style={[styles.dropdownItem, status === 'tersedia' && styles.dropdownItemActive]}
                onPress={() => {
                  setStatus('tersedia');
                  setShowDropdown(false);
                }}
              >
                <ThemedText style={[styles.dropdownItemText, status === 'tersedia' && styles.dropdownItemTextActive]}>
                  Tersedia (Ready)
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dropdownItem, status === 'terjual' && styles.dropdownItemActive]}
                onPress={() => {
                  setStatus('terjual');
                  setShowDropdown(false);
                }}
              >
                <ThemedText style={[styles.dropdownItemText, status === 'terjual' && styles.dropdownItemTextActive]}>
                  Terjual (Sold)
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.submitButtonText}>Simpan ke Database</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 24 },
  header: { marginVertical: 24, gap: 12 },
  form: { gap: 16 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  dateInputButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#334155',
  },
  submitButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: '600' },
  backButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#0284c7',
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#0f172a',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#64748b',
  },
  dropdownMenu: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    marginTop: -8,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownItemActive: {
    backgroundColor: '#f0f9ff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#334155',
  },
  dropdownItemTextActive: {
    color: '#0284c7',
    fontWeight: '600',
  },
});
