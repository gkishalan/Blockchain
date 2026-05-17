"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAllTranslations, LANGUAGES } from "./translations";

const LanguageContext = createContext();

const STORAGE_KEY = "blockchat_language";

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState("en");
    const [strings, setStrings] = useState(getAllTranslations("en"));

    // Load saved language on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) || "en";
        applyLanguage(saved);
    }, []);

    const applyLanguage = useCallback((code) => {
        setLang(code);
        setStrings(getAllTranslations(code));
        localStorage.setItem(STORAGE_KEY, code);

        // Apply RTL/LTR direction to the document
        const langObj = LANGUAGES.find((l) => l.code === code);
        const dir = langObj?.dir || "ltr";
        document.documentElement.lang = code;
        document.documentElement.dir = dir;
    }, []);

    // Translation function: t("key") -> translated string
    const t = useCallback((key) => strings[key] || key, [strings]);

    return (
        <LanguageContext.Provider value={{ lang, setLanguage: applyLanguage, t, strings }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Convenience hook
export const useLanguage = () => useContext(LanguageContext);
