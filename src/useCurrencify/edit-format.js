import { ref } from 'vue';
// DİKKAT: entries listesini PageEntriesVue.vue dosyasından ARGÜMAN olarak alır.
export function useEditEntry(entries) {
  // 1. STATE (Gerekli tüm reaktif değişkenler)
  const editingId = ref(null);
  const description = ref('');
  const amount = ref('');
  // 2. DÜZENLEMEYI BAŞLATMA FONKSİYONU (Tıklama)
  const handleEditStart = (entry) => {
    // Eğer zaten düzenliyorsa dur
    if (editingId.value === entry.id) return;
    // State'i güncelle
    description.value = entry.name;
    amount.value = entry.amount.toString();
    editingId.value = entry.id;
  };
  // 3. KAYDETME VE MODDAN ÇIKMA FONKSİYONU (@blur ve @keyup.enter tetikler)
  const handleSave = (idToUpdate) => {
    if (!editingId.value) return;
    // entries listesini günceller (Çünkü entries, PageEntriesVue.vue'daki ana ref'e referans)
    entries.value = entries.value.map(entry => {
      if (entry.id === idToUpdate) {
        return {
          ...entry,
          name: description.value.trim(),
          amount: parseFloat(amount.value)
        };
      }
      return entry; // Diğer öğeleri değiştirme
    });
    // Düzenleme modunu çıkış (Input -> Metin dönüşümü için kritik)
    editingId.value = null;
  };
  // 4. Template'in ihtiyaç duyacağı her şeyi döndürür
  return {
    editingId,
    description,
    amount,
    handleEditStart,
    handleSave,
  };
}

// scroll lıstenın eklenen kısmını gorebılecek sekılde kaydırıryor
export function scrollToEntry(id) {

  // 1. Öğe ID'sinin tam formatını kullanın
  const fullId = 'entry-' + id;
  const element = document.getElementById(fullId);

  if (element) {
    // 2. Elementin kendisini görünür alana kaydırma (offset hesaplaması yok!)
    element.scrollIntoView({
      behavior: 'smooth', // Yumuşak geçiş
      block: 'start'  ,      // Öğeyi kapsayıcının alt kısmına hizala (İstenen scroll sonu)
    });


  }
}

