import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          "Welcome to React": "Welcome to React and react-i18next", // Example translation
          "Home": "Home", // Header/Nav
          "Find Pharmacies": "Find Pharmacies", // Header/Nav
          "Medications": "Medications", // Header/Nav
          "Blood Donation": "Blood Donation", // Header/Nav
          "Health Assistant": "Health Assistant", // Header/Nav
          "Profile": "Profile", // Header dropdown
          "Settings": "Settings", // Header dropdown
          "Pharmacy Dashboard": "Pharmacy Dashboard", // Header dropdown
          "Admin Panel": "Admin Panel", // Header dropdown
          "Logout": "Logout", // Header dropdown
          "Login / Register": "Login / Register", // Header button
          "Notifications": "Notifications", // Header notification title
          "No notifications": "No notifications", // Header notification empty state
          "View all notifications": "View all notifications", // Header notification link
          "New": "New", // Notification badge

          // Home Page
          "home.hero.title1": "Find the Right Pharmacy,",
          "home.hero.title2": "Right When You Need It",
          "home.hero.description": "Locate nearby pharmacies, check medication availability, get health advice, and contribute to blood donation initiatives.",
          "home.hero.findPharmacies": "Find Pharmacies",
          "home.hero.searchMedications": "Search Medications",
          "home.features.title": "How PharMatch Helps You",
          "home.features.description": "Comprehensive health services at your fingertips.",
          "home.features.findPharmacies.title": "Find Nearby Pharmacies",
          "home.features.findPharmacies.description": "Locate pharmacies in your area based on your location or by searching city names.",
          "home.features.checkMedication.title": "Check Medication Availability",
          "home.features.checkMedication.description": "Search for medications and discover which pharmacies have them in stock.",
          "home.features.healthAssistant.title": "Health Assistant",
          "home.features.healthAssistant.description": "Ask health-related questions and get reliable information from our AI assistant.",
          "home.features.bloodDonation.title": "Blood Donation",
          "home.features.bloodDonation.description": "Register as a blood donor and receive alerts for urgent donation needs in your area.",
          "home.urgentNeeds.title": "Urgent Blood Donation Needs",
          "home.urgentNeeds.description": "These blood types are urgently needed at hospitals near you",
          "home.urgentNeeds.bloodType": "Blood Type: {{bloodType}}",
          "home.urgentNeeds.urgent": "URGENT",
          "home.urgentNeeds.hospital": "Hospital: {{hospital}}",
          "home.urgentNeeds.contact": "Contact: {{contactInfo}}",
          "home.urgentNeeds.postedOn": "Posted on {{date}}",
          "home.urgentNeeds.donateButton": "I Want to Donate",
          "home.urgentNeeds.viewAll": "View All Blood Donation Requests",
          "home.testimonials.title": "What Our Users Say",
          "home.testimonials.description": "Join thousands of satisfied users who rely on PharMatch every day.",
          "home.testimonials.sarah.quote": "PharMatch helped me find a pharmacy with my medication in stock when I was traveling. Saved me hours of searching!",
          "home.testimonials.sarah.name": "Sarah Johnson",
          "home.testimonials.sarah.role": "Regular User",
          "home.testimonials.michael.quote": "As a pharmacist, this platform has made it easier to update our inventory and connect with patients who need specific medications.",
          "home.testimonials.michael.name": "Dr. Michael Chen",
          "home.testimonials.michael.role": "Pharmacy Owner",
          "home.testimonials.emily.quote": "The health assistant answered all my questions about my medication. It was like having a pharmacist available 24/7!",
          "home.testimonials.emily.name": "Emily Rodriguez",
          "home.testimonials.emily.role": "New User",
          "home.cta.title": "Ready to Find Your Nearest Pharmacy?",
          "home.cta.description": "Join PharMatch today and connect with pharmacies, find medications, and contribute to blood donation initiatives.",
          "home.cta.findPharmacies": "Find Pharmacies Now",
          "home.cta.createAccount": "Create an Account",

          //login 
          "login.title": "Login",
        }
      },
      ar: {
        translation: {
          "Welcome to React": "مرحباً بك في React وreact-i18next", // Example translation
          "Home": "الصفحة الرئيسية", // Header/Nav
          "Find Pharmacies": "البحث عن صيدليات", // Header/Nav
          "Medications": "الأدوية", // Header/Nav
          "Blood Donation": "التبرع بالدم", // Header/Nav
          "Health Assistant": "مساعد صحي", // Header/Nav
          "Profile": "الملف الشخصي", // Header dropdown
          "Settings": "الإعدادات", // Header dropdown
          "Pharmacy Dashboard": "لوحة تحكم الصيدلية", // Header dropdown
          "Admin Panel": "لوحة تحكم الإدارة", // Header dropdown
          "Logout": "تسجيل الخروج", // Header dropdown
          "Login / Register": "تسجيل الدخول / التسجيل", // Header button
          "Notifications": "الإشعارات", // Header notification title
          "No notifications": "لا توجد إشعارات", // Header notification empty state
          "View all notifications": "عرض جميع الإشعارات", // Header notification link
          "New": "جديد", // Notification badge

          // Home Page
          "home.hero.title": "ابحث عن الصيدلية المناسبة، <br />في الوقت الذي تحتاج إليه",
          "home.hero.description": "حدد مواقع الصيدليات القريبة، تحقق من توفر الأدوية، احصل على نصائح صحية، وساهم في مبادرات التبرع بالدم.",
          "home.hero.findPharmacies": "ابحث عن الصيدليات",
          "home.hero.searchMedications": "ابحث عن الأدوية",
          "home.features.title": "كيف يساعدك فارماتش",
          "home.features.description": "خدمات صحية شاملة في متناول يدك.",
          "home.features.findPharmacies.title": "ابحث عن صيدليات قريبة",
          "home.features.findPharmacies.description": "حدد مواقع الصيدليات في منطقتك بناءً على موقعك أو بالبحث بأسماء المدن.",
          "home.features.checkMedication.title": "تحقق من توفر الأدوية",
          "home.features.checkMedication.description": "ابحث عن الأدوية واكتشف أي الصيدليات لديها مخزون منها.",
          "home.features.healthAssistant.title": "المساعد الصحي",
          "home.features.healthAssistant.description": "اسأل أسئلة تتعلق بالصحة واحصل على معلومات موثوقة من مساعدنا الذكي.",
          "home.features.bloodDonation.title": "التبرع بالدم",
          "home.features.bloodDonation.description": "سجل كمتبرع بالدم وتلقَ تنبيهات لاحتياجات التبرع العاجلة في منطقتك.",
          "home.urgentNeeds.title": "احتياجات التبرع بالدم العاجلة",
          "home.urgentNeeds.description": "هذه الفصائل الدموية مطلوبة بشكل عاجل في المستشفيات القريبة منك",
          "home.urgentNeeds.bloodType": "فصيلة الدم: {{bloodType}}",
          "home.urgentNeeds.urgent": "عاجل",
          "home.urgentNeeds.hospital": "المستشفى: {{hospital}}",
          "home.urgentNeeds.contact": "جهة الاتصال: {{contactInfo}}",
          "home.urgentNeeds.postedOn": "نُشر في {{date}}",
          "home.urgentNeeds.donateButton": "أريد التبرع",
          "home.urgentNeeds.viewAll": "عرض جميع طلبات التبرع بالدم",
          "home.testimonials.title": "ماذا يقول مستخدمونا",
          "home.testimonials.description": "انضم إلى آلاف المستخدمين الراضين الذين يعتمدون على فارماتش يوميًا.",
          "home.testimonials.sarah.quote": "ساعدني فارماتش في العثور على صيدلية تحتوي على دوائي في المخزون أثناء سفري. وفر عليّ ساعات من البحث!",
          "home.testimonials.sarah.name": "سارة جونسون",
          "home.testimonials.sarah.role": "مستخدم عادي",
          "home.testimonials.michael.quote": "كصيدلي، جعلت هذه المنصة تحديث مخزوننا والاتصال بالمرضى الذين يحتاجون إلى أدوية معينة أمرًا أسهل.",
          "home.testimonials.michael.name": "د. مايكل تشين",
          "home.testimonials.michael.role": "مالك صيدلية",
          "home.testimonials.emily.quote": "أجاب المساعد الصحي على جميع أسئلتي حول دوائي. كأن لدي صيدلي متاح على مدار الساعة!",
          "home.testimonials.emily.name": "إميلي رودريغيز",
          "home.testimonials.emily.role": "مستخدم جديد",
          "home.cta.title": "هل أنت جاهز للعثور على أقرب صيدلية؟",
          "home.cta.description": "انضم إلى فارماتش اليوم وتواصل مع الصيدليات، وابحث عن الأدوية، وساهم في مبادرات التبرع بالدم.",
          "home.cta.findPharmacies": "ابحث عن الصيدليات الآن",
          "home.cta.createAccount": "إنشاء حساب"

        }
      }
      ,
      fr: {
        translation: {
          "Welcome to React": "Bienvenue à React et react-i18next",
          "Home": "Accueil",
          "Find Pharmacies": "Trouver des pharmacies",
          "Medications": "Médicaments",
          "Blood Donation": "Don de sang",
          "Health Assistant": "Assistant de santé", // Header/Nav
          "Profile": "Profil", // Header dropdown
          "Settings": "Paramètres", // Header dropdown
          "Pharmacy Dashboard": "Tableau de bord pharmacie", // Header dropdown
          "Admin Panel": "Panneau d'administration", // Header dropdown
          "Logout": "Déconnexion", // Header dropdown
          "Login / Register": "Connexion / Inscription", // Header button

          //Home Page
          "home.hero.title": "Trouvez la bonne pharmacie, <br />quand vous en avez besoin",
          "home.hero.description": "Localisez les pharmacies à proximité, vérifiez la disponibilité des médicaments, obtenez des conseils de santé et contribuez aux initiatives de don de sang.",
          "home.hero.findPharmacies": "Trouver des pharmacies",
          "home.hero.searchMedications": "Rechercher des médicaments",
          "home.features.title": "Comment PharMatch vous aide",
          "home.features.description": "Des services de santé complets à portée de main.",
          "home.features.findPharmacies.title": "Trouver des pharmacies à proximité",
          "home.features.findPharmacies.description": "Localisez les pharmacies dans votre région en fonction de votre emplacement ou en recherchant des noms de villes.",
          "home.features.checkMedication.title": "Vérifier la disponibilité des médicaments",
          "home.features.checkMedication.description": "Recherchez des médicaments et découvrez quelles pharmacies les ont en stock.",
          "home.features.healthAssistant.title": "Assistant de santé",
          "home.features.healthAssistant.description": "Posez des questions liées à la santé et obtenez des informations fiables de notre assistant IA.",
          "home.features.bloodDonation.title": "Don de sang",
          "home.features.bloodDonation.description": "Inscrivez-vous comme donneur de sang et recevez des alertes pour les besoins urgents de dons dans votre région.",
          "home.urgentNeeds.title": "Besoins urgents de dons de sang",
          "home.urgentNeeds.description": "Ces groupes sanguins sont nécessaires de toute urgence dans les hôpitaux près de chez vous",
          "home.urgentNeeds.bloodType": "Groupe sanguin : {{bloodType}}",
          "home.urgentNeeds.urgent": "URGENT",
          "home.urgentNeeds.hospital": "Hôpital : {{hospital}}",
          "home.urgentNeeds.contact": "Contact : {{contactInfo}}",
          "home.urgentNeeds.postedOn": "Publié le {{date}}",
          "home.urgentNeeds.donateButton": "Je veux donner",
          "home.urgentNeeds.viewAll": "Voir toutes les demandes de don de sang",
          "home.testimonials.title": "Ce que disent nos utilisateurs",
          "home.testimonials.description": "Rejoignez des milliers d'utilisateurs satisfaits qui font confiance à PharMatch tous les jours.",
          "home.testimonials.sarah.quote": "PharMatch m'a aidé à trouver une pharmacie avec mon médicament en stock pendant que je voyageais. Cela m’a fait gagner des heures de recherche !",
          "home.testimonials.sarah.name": "Sarah Johnson",
          "home.testimonials.sarah.role": "Utilisateur régulier",
          "home.testimonials.michael.quote": "En tant que pharmacien, cette plateforme a facilité la mise à jour de notre inventaire et la connexion avec les patients ayant besoin de médicaments spécifiques.",
          "home.testimonials.michael.name": "Dr Michael Chen",
          "home.testimonials.michael.role": "Propriétaire de pharmacie",
          "home.testimonials.emily.quote": "L'assistant de santé a répondu à toutes mes questions sur mon médicament. C’était comme avoir un pharmacien disponible 24h/24 et 7j/7 !",
          "home.testimonials.emily.name": "Emily Rodriguez",
          "home.testimonials.emily.role": "Nouvel utilisateur",
          "home.cta.title": "Prêt à trouver votre pharmacie la plus proche ?",
          "home.cta.description": "Rejoignez PharMatch aujourd'hui et connectez-vous avec des pharmacies, trouvez des médicaments et contribuez aux initiatives de don de sang.",
          "home.cta.findPharmacies": "Trouver des pharmacies maintenant",
          "home.cta.createAccount": "Créer un compte",
        }
      }
    }
  });

export default i18n;