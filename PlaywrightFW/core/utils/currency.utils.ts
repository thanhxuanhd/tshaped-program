export class CurrencyUtils {
    static formatCurrency(amount: number, locale = 'vi-VN', currency = 'VND'): string {
        const formatted = new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
        // Intl inserts a non-breaking space and uses the '₫' (U+20AB) sign, but the site displays 'đ' (U+0111)
        return formatted.replace(/\s/g, '').replace('₫', 'đ');
    }
}
