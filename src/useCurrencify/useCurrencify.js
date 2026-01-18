import { useSettingsStore } from "src/stores/settings";

// Fonksiyonun kendisi artık bir Composable görevi görüyor
export function useCurrency() {
    // 1. Settings Store'u Composable içinde çağırın
    const settingsStore = useSettingsStore();

    // 2. Formatlama işlemini yapan fonksiyonu döndürün
    const formatAmount = (amount) => {
        // ... (guard kısmı aynı kalacak)
        if (amount == null || isNaN(Number(amount))) {
            return "";
        }

        let posNegSymbol = '';
        if (amount > 0) {
            posNegSymbol = '+';
        } else if (amount < 0) {
            posNegSymbol = '-';
        }

        const amountPositive = Math.abs(amount); // mutlak değer

        // 🚨 Sembolü settingsStore'dan reaktif olarak alın
        const currencySymbol = settingsStore.currencySymbol;

        const amountFormatted = amountPositive.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return `${posNegSymbol} ${currencySymbol} ${amountFormatted} `;
    };

    // Formatlayıcı fonksiyonu dışarı döndürün
    return formatAmount;
}
