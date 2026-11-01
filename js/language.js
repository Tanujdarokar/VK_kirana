// Apni Kirana - Multilingual Translation Engine (English & Hindi)

const translations = {
  en: {
    siteName: "Apni Kirana",
    tagline: "Aapki Apni Dukan, Ab Online!",
    navHome: "Home",
    navShop: "Shop",
    navCategories: "Categories",
    navOffers: "Offers",
    navAbout: "About Us",
    navContact: "Contact",
    navLogin: "Login / Account",
    navCart: "Cart",
    navAdmin: "Admin",
    navTrack: "Track Order",
    searchPlaceholder: "Search atta, rice, oil, milk, spices...",
    locationPlaceholder: "Enter address or 6-digit Pincode",
    heroTitle: "Fresh Groceries, Best Prices!",
    heroSubtitle: "Get 100% pure, farm-fresh staples delivered straight from your local Kirana store to your doorstep in 15 minutes.",
    shopNow: "Shop Now",
    exploreCategories: "Featured Grocery Aisles",
    bestSellers: "Bestselling Essentials",
    specialOffers: "Today's Special Offers",
    dailyEssentials: "Daily Pantry Staples",
    whyChooseUs: "Why Shop With Apni Kirana?",
    feature1Title: "15-Min Instant Delivery",
    feature1Desc: "Superfast delivery straight from your neighborhood Kirana shop.",
    feature2Title: "Wholesale Kirana Prices",
    feature2Desc: "Wholesale rates 10-15% lower than dark stores.",
    feature3Title: "100% Pure Staples",
    feature3Desc: "Sealed, original brand items: Aashirvaad, Fortune, Amul, Tata.",
    feature4Title: "Cash on Delivery & UPI",
    feature4Desc: "Zero prepayment required. Pay at your doorstep with Cash or UPI.",
    testimonialsTitle: "What Our Customers Say",
    addToCart: "Add to Cart",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    lowStock: "Low Stock",
    viewProducts: "View Products",
    footerTimings: "Store Timings: 7:00 AM - 10:00 PM (Mon-Sun)",
    footerContact: "Toll Free: 1800-419-8899 | Care@apnikirana.in",
    footerRights: "© 2025 Apni Kirana. Aapki Apni Dukan, Ab Online! All rights reserved.",

    // Kirana Categories
    catAnaj: "Anaj (Rice & Wheat)",
    catDaal: "Daal & Pulses",
    catTel: "Cooking Oil & Ghee",
    catDoodh: "Dairy Products",
    catMasale: "Spices & Masala",
    catSnacks: "Snacks & Biscuits",
    catTea: "Tea & Coffee",
    catCare: "Personal Care",
    catCleaning: "Household Cleaning",
    catDryFruits: "Dry Fruits & Grocery",

    // Cart & Checkout
    cartTitle: "Your Kirana Shopping Cart",
    emptyCartMsg: "Your shopping cart is empty!",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    discount: "Coupon Discount",
    grandTotal: "Total Amount",
    applyCoupon: "Apply Coupon",
    couponPlaceholder: "Enter coupon (e.g. KIRANA10)",
    proceedCheckout: "Proceed to Checkout",
    placeOrder: "Place Order (Cash / UPI on Delivery)",
    orderSuccessTitle: "Order Placed Successfully!",
    orderIdLabel: "Order Reference ID:",
    trackOrderBtn: "Track Order Status",

    // Auth
    loginTitle: "Customer & Vendor Login",
    registerTitle: "Create Free Account",
    rememberMe: "Remember Me"
  },

  hi: {
    siteName: "अपनी किराना",
    tagline: "आपकी अपनी दुकान, अब ऑनलाइन!",
    navHome: "होम",
    navShop: "दुकान / सामान",
    navCategories: "श्रेणियां",
    navOffers: "ऑफर्स",
    navAbout: "हमारे बारे में",
    navContact: "संपर्क",
    navLogin: "लॉगिन / खाता",
    navCart: "कार्ट",
    navAdmin: "एडमिन",
    navTrack: "ऑर्डर ट्रैक करें",
    searchPlaceholder: "आटा, चावल, तेल, दूध, मसाले खोजें...",
    locationPlaceholder: "पता या 6-अंकीय पिनकोड दर्ज करें",
    heroTitle: "ताज़ा किराना, सबसे कम दाम!",
    heroSubtitle: "अपनी स्थानीय किराना दुकान से 100% शुद्ध आटा, दाल, दूध और तेल सीधे 15 मिनट में अपने घर मंगवाएं।",
    shopNow: "अभी खरीदारी करें",
    exploreCategories: "मुख्य किराना श्रेणियां",
    bestSellers: "सबसे ज्यादा बिकने वाला सामान",
    specialOffers: "आज के विशेष ऑफर्स",
    dailyEssentials: "दैनिक राशन आवश्यकताएं",
    whyChooseUs: "अपनी किराना से क्यों खरीदें?",
    feature1Title: "15 मिनट में डिलीवरी",
    feature1Desc: "आपकी अपनी पड़ोसी किराना दुकान से सुपरफास्ट डिलीवरी।",
    feature2Title: "होलसेल किराना रेट",
    feature2Desc: "बाजार से 10-15% सस्ते होलसेल दाम।",
    feature3Title: "100% शुद्ध व सीलबंद सामान",
    feature3Desc: "असली ब्रांड्स: आशीर्वाद, फॉर्च्यून, अमूल, टाटा चाय।",
    feature4Title: "कैश ऑन डिलीवरी और UPI",
    feature4Desc: "कोई एडवांस पेमेंट नहीं। डिलीवरी पर नकद या UPI से भुगतान करें।",
    testimonialsTitle: "हमारे ग्राहकों की राय",
    addToCart: "कार्ट में जोड़ें",
    inStock: "स्टॉक में है",
    outOfStock: "स्टॉक खत्म",
    lowStock: "कम स्टॉक",
    viewProducts: "सामान देखें",
    footerTimings: "दुकान का समय: सुबह 7:00 बजे से रात 10:00 बजे तक (सातों दिन)",
    footerContact: "टोल फ्री: 1800-419-8899 | Care@apnikirana.in",
    footerRights: "© 2025 अपनी किराना। आपकी अपनी दुकान, अब ऑनलाइन! सर्वाधिकार सुरक्षित।",

    // Kirana Categories
    catAnaj: "अनाज (चावल और आटा)",
    catDaal: "दाल और दलहन",
    catTel: "खाने का तेल और घी",
    catDoodh: "दूध और डेयरी",
    catMasale: "मसाले और सामग्री",
    catSnacks: "नाश्ता और बिस्किट",
    catTea: "चाय और कॉफी",
    catCare: "पर्सनल केयर",
    catCleaning: "घर की सफाई",
    catDryFruits: "ड्राई फ्रूट्स व किराना",

    // Cart & Checkout
    cartTitle: "आपकी किराना शॉपिंग कार्ट",
    emptyCartMsg: "आपकी कार्ट अभी खाली है!",
    subtotal: "कुल मूल्य",
    deliveryFee: "डिलीवरी शुल्क",
    discount: "कूपन छूट",
    grandTotal: "कुल देय राशि",
    applyCoupon: "कूपन लागू करें",
    couponPlaceholder: "कूपन कोड (जैसे KIRANA10)",
    proceedCheckout: "चेकआउट के लिए आगे बढ़ें",
    placeOrder: "ऑर्डर कन्फर्म करें (नकद / UPI)",
    orderSuccessTitle: "ऑर्डर सफलता पूर्वक सबमिट हुआ!",
    orderIdLabel: "ऑर्डर रेफरेंस ID:",
    trackOrderBtn: "ऑर्डर की स्थिति देखें",

    // Auth
    loginTitle: "ग्राहक व दुकानदार लॉगिन",
    registerTitle: "नया खाता बनाएं",
    rememberMe: "मुझे याद रखें"
  }
};

class LanguageEngine {
  constructor() {
    this.currentLang = localStorage.getItem('apnikirana_lang') || 'en';
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('apnikirana_lang', lang);
      this.applyTranslations();
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }

  getLang() {
    return this.currentLang;
  }

  t(key) {
    return translations[this.currentLang]?.[key] || translations['en']?.[key] || key;
  }

  applyTranslations() {
    document.documentElement.lang = this.currentLang;

    // Update text content for elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && translations[this.currentLang]?.[key]) {
        el.textContent = translations[this.currentLang][key];
      }
    });

    // Update placeholders with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && translations[this.currentLang]?.[key]) {
        el.placeholder = translations[this.currentLang][key];
      }
    });

    // Toggle button active state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

window.LangEngine = new LanguageEngine();
