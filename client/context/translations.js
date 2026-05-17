// Internationalization (i18n) module for BlockChat
// All UI strings and supported languages

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "zh", name: "Chinese", nativeName: "中文", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
];

const en = {
  // NavBar
  nav_allUsers: "All Users",
  nav_chat: "Chat",
  nav_profile: "Profile",
  nav_settings: "Settings",
  nav_faqs: "FAQs",
  nav_terms: "Terms of Use",

  // Settings
  settings_title: "Settings",
  settings_subtitle: "Customize your BlockChat experience",
  settings_profilePhoto: "Profile Photo",
  settings_editInfo: "Edit Info",
  settings_language: "Language",
  settings_chatSettings: "Chat Settings",
  settings_notifications: "Notifications",
  settings_dataStorage: "Data & Storage",
  settings_uploadPhoto: "Upload Photo",
  settings_removePhoto: "Remove Photo",
  settings_changePhoto: "Change Photo",
  settings_photoHint: "Upload a photo from your device. Max 5MB.",
  
  // Chat
  chat_typeMessage: "Type your message",
  
  // Filter
  filter_search: "Search friends...",
  filter_addFriend: "Add Friend",
  
  // Login
  login_createTitle: "Create Your Identity",
  login_createHint: "Choose a username for the blockchain.",
  login_namePlaceholder: "Enter your username",
  login_createAccount: "Get Started",
  login_footer: "Powered by Ethereum Blockchain",

  // Profile
  profile_title: "Wallet Profile",
  profile_subtitle: "Manage your digital assets and transaction history",
  profile_editIdentity: "EDIT IDENTITY",
  profile_privacySettings: "PRIVACY SETTINGS",
  profile_totalPortfolio: "Total Portfolio",
  profile_send: "Send",
  profile_receive: "Receive",
  profile_walletAddress: "PUBLIC WALLET ADDRESS",
  profile_copy: "Copy",
  profile_recentChats: "Recent Chat History",
  profile_noChats: "No recent chats found.",
};

const es = {
  nav_allUsers: "Todos los usuarios",
  nav_chat: "Chat",
  nav_profile: "Perfil",
  nav_settings: "Ajustes",
  nav_terms: "Condiciones",
  settings_title: "Ajustes",
  settings_subtitle: "Personaliza tu experiencia en BlockChat",
  settings_profilePhoto: "Foto de perfil",
  settings_editInfo: "Editar información",
  settings_language: "Idioma",
  settings_chatSettings: "Ajustes de chat",
  settings_notifications: "Notificaciones",
  settings_dataStorage: "Datos y almacenamiento",
  settings_uploadPhoto: "Subir foto",
  settings_removePhoto: "Eliminar foto",
  settings_changePhoto: "Cambiar foto",
  settings_photoHint: "Sube una foto desde tu dispositivo. Máx 5MB.",
  chat_typeMessage: "Escribe tu mensaje",
  filter_search: "Buscar amigos...",
  filter_addFriend: "Añadir amigo",
  login_createTitle: "Crea tu identidad",
  login_createHint: "Elige un nombre de usuario para la blockchain.",
  login_namePlaceholder: "Introduce tu usuario",
  login_createAccount: "Empezar",
  login_footer: "Desarrollado por Ethereum Blockchain",
  profile_title: "Perfil de billetera",
  profile_subtitle: "Gestiona tus activos digitales e historial",
  profile_editIdentity: "EDITAR IDENTIDAD",
  profile_privacySettings: "AJUSTES DE PRIVACIDAD",
  profile_totalPortfolio: "Portafolio total",
  profile_send: "Enviar",
  profile_receive: "Recibir",
  profile_walletAddress: "DIRECCIÓN PÚBLICA",
  profile_copy: "Copiar",
  profile_recentChats: "Historial de chat reciente",
  profile_noChats: "No se encontraron chats recientes.",
};

const fr = {
  nav_allUsers: "Tous les utilisateurs",
  nav_chat: "Discussion",
  nav_profile: "Profil",
  nav_settings: "Paramètres",
  nav_terms: "Conditions",
  settings_title: "Paramètres",
  settings_subtitle: "Personnalisez votre expérience",
  settings_profilePhoto: "Photo de profil",
  settings_editInfo: "Modifier les infos",
  settings_language: "Langue",
  settings_chatSettings: "Paramètres de chat",
  settings_notifications: "Notifications",
  settings_dataStorage: "Données et stockage",
  settings_uploadPhoto: "Importer une photo",
  settings_removePhoto: "Supprimer la photo",
  settings_changePhoto: "Changer de photo",
  settings_photoHint: "Importez une photo. Max 5MB.",
  chat_typeMessage: "Tapez votre message",
  filter_search: "Rechercher des amis...",
  filter_addFriend: "Ajouter un ami",
  profile_title: "Profil du portefeuille",
};

const ar = {
  nav_allUsers: "جميع المستخدمين",
  nav_chat: "محادثة",
  nav_profile: "حساب تعريفي",
  nav_settings: "إعدادات",
  nav_terms: "شروط الاستخدام",
  settings_title: "إعدادات",
  settings_subtitle: "تخصيص تجربتك",
  settings_profilePhoto: "صورة الملف الشخصي",
  settings_editInfo: "تعديل المعلومات",
  settings_language: "لغة",
  settings_chatSettings: "إعدادات الدردشة",
  settings_notifications: "إشعارات",
  settings_dataStorage: "البيانات والتخزين",
  chat_typeMessage: "اكتب رسالتك",
  filter_search: "البحث عن أصدقاء...",
  filter_addFriend: "إضافة صديق",
  profile_title: "محفظة الملف الشخصي",
};

const zh = {
  nav_allUsers: "所有用户",
  nav_chat: "聊天",
  nav_profile: "个人资料",
  nav_settings: "设置",
  nav_terms: "使用条款",
  settings_title: "设置",
  settings_subtitle: "自定义您的体验",
  settings_profilePhoto: "个人资料照片",
  settings_editInfo: "编辑信息",
  settings_language: "语言",
  settings_chatSettings: "聊天设置",
  settings_notifications: "通知",
  settings_dataStorage: "数据与存储",
  chat_typeMessage: "输入您的消息",
  filter_search: "搜索好友...",
  filter_addFriend: "添加好友",
  profile_title: "钱包资料",
};

const hi = {
  nav_allUsers: "सभी उपयोगकर्ता",
  nav_chat: "चैट",
  nav_profile: "प्रोफ़ाइल",
  nav_settings: "सेटिंग्स",
  nav_terms: "उपयोग की शर्तें",
  settings_title: "सेटिंग्स",
  settings_subtitle: "अपना अनुभव अनुकूलित करें",
  settings_profilePhoto: "प्रोफ़ाइल फोटो",
  settings_editInfo: "जानकारी संपादित करें",
  settings_language: "भाषा",
  settings_chatSettings: "चैट सेटिंग्स",
  chat_typeMessage: "अपना संदेश टाइप करें",
  filter_search: "दोस्तों को खोजें...",
  filter_addFriend: "दोस्त जोड़ें",
  profile_title: "वॉलेट प्रोफाइल",
};

const translations = { en, es, fr, ar, zh, hi };

export function getTranslation(langCode, key) {
  const langStrings = translations[langCode];
  if (langStrings && langStrings[key]) return langStrings[key];
  return en[key] || key;
}

export function getAllTranslations(langCode) {
  const langStrings = translations[langCode] || {};
  return { ...en, ...langStrings };
}
