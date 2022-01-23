import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Index = () => {
    const { i18n } = useTranslation()
    const [selectedLang, setSelectedLang] = useState(localStorage.getItem('language'));
    const changeLanguage = event => {
        setSelectedLang(event.target.value)
        i18n.changeLanguage(event.target.value)
        localStorage.setItem('language', event.target.value)
    }

    return (
        <div className="language-selector-container mx-2 pt-1" onChange={changeLanguage}>
            <select
                className="shadow-none form-control form-control-sm border-0 p-0 m-0"
                defaultValue={selectedLang}
                style={{ fontSize: 14, fontWeight: 400, background: "none" }}
            >
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
            </select>
        </div>
    );
}

export default Index;