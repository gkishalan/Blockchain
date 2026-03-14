// Internationalization (i18n) module for BlockChat
// All UI strings and supported languages

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", dir: "ltr" },
  { code: "ca", name: "Catalan", nativeName: "Català", dir: "ltr" },
  { code: "cs", name: "Czech", nativeName: "Čeština", dir: "ltr" },
  { code: "da", name: "Danish", nativeName: "Dansk", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", dir: "ltr" },
  { code: "fil", name: "Filipino", nativeName: "Filipino", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "he", name: "Hebrew", nativeName: "עברית", dir: "rtl" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", dir: "ltr" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", dir: "ltr" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", dir: "ltr" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", dir: "ltr" },
  { code: "nb", name: "Norwegian", nativeName: "Norsk bokmål", dir: "ltr" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", dir: "ltr" },
  { code: "pl", name: "Polish", nativeName: "Polski", dir: "ltr" },
  { code: "pt-BR", name: "Portuguese (Brazil)", nativeName: "Português (BR)", dir: "ltr" },
  { code: "pt-PT", name: "Portuguese (Portugal)", nativeName: "Português (PT)", dir: "ltr" },
  { code: "ro", name: "Romanian", nativeName: "Română", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", dir: "ltr" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", dir: "ltr" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", dir: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", dir: "ltr" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", dir: "ltr" },
  { code: "ur", name: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", dir: "ltr" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "中文简体", dir: "ltr" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "中文繁體", dir: "ltr" },
];

// English strings (default — used as fallback for all languages)
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
  settings_displayName: "Display Name",
  settings_displayNamePlaceholder: "Enter a display name...",
  settings_bio: "Bio",
  settings_bioPlaceholder: "Tell something about yourself...",
  settings_birthday: "Birthday",
  settings_username: "Username (on-chain)",
  settings_usernameHint: "Username is stored on the blockchain and cannot be changed here.",
  settings_walletAddress: "Wallet Address",
  settings_save: "Save Changes",
  settings_saved: "Saved!",
  settings_searchLanguage: "Search languages...",
  settings_fontSize: "Font Size",
  settings_fontSmall: "Small",
  settings_fontMedium: "Medium",
  settings_fontLarge: "Large",
  settings_bubbleStyle: "Message Bubble Style",
  settings_bubbleRounded: "Rounded",
  settings_bubbleSharp: "Sharp",
  settings_enterToSend: "Press Enter to Send",
  settings_enterToSendHint: "When enabled, pressing Enter sends the message. Use Shift+Enter for new line.",
  settings_messageSound: "Message Sound",
  settings_messageSoundHint: "Play a sound when you receive a new message.",
  settings_desktopNotif: "Desktop Notifications",
  settings_desktopNotifHint: "Show browser notifications for new messages.",
  settings_storageUsed: "Storage Used",
  settings_clearData: "Clear Chat Data",
  settings_clearDataHint: "This will clear all locally cached chat data. Messages on the blockchain are not affected.",
  settings_exportData: "Export Chat Data",
  settings_exportDataHint: "Download all your chat data as a JSON file.",
  settings_clearConfirm: "Are you sure? This will clear all local chat data.",
  settings_cleared: "Data cleared!",
  settings_exported: "Data exported!",

  // Chat
  chat_typeMessage: "Type your message",
  chat_downloadDoc: "Download Document",

  // Filter
  filter_search: "Search friends...",
  filter_addFriend: "Add Friend",

  // Login
  login_welcome: "Welcome to",
  login_appName: "BlockChat",
  login_subtitle: "Connect your wallet and create your account to start chatting on the blockchain.",
  login_connectWallet: "Connect Wallet",
  login_step1: "Step 1",
  login_step2: "Step 2",
  login_connectTitle: "Connect Your Wallet",
  login_connectHint: "Link your MetaMask wallet to get started.",
  login_createTitle: "Create Your Identity",
  login_createHint: "Choose a username for the blockchain.",
  login_namePlaceholder: "Enter your username",
  login_createAccount: "Create Account",
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

// Translation map — for now English is the only fully translated language.
// Other languages use English as fallback. This structure allows incremental translation.
const translations = { en };

/**
 * Get a translated string. Falls back to English if the key is missing.
 * @param {string} langCode - e.g. "en", "fr", "ta"
 * @param {string} key - e.g. "settings_title"
 * @returns {string}
 */
export function getTranslation(langCode, key) {
  const langStrings = translations[langCode];
  if (langStrings && langStrings[key]) return langStrings[key];
  return en[key] || key;
}

/**
 * Get all translations for a language (merged with English fallback)
 * @param {string} langCode
 * @returns {object}
 */
export function getAllTranslations(langCode) {
  const langStrings = translations[langCode] || {};
  return { ...en, ...langStrings };
}
