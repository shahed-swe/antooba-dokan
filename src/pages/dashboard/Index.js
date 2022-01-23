import React from 'react'
import { useTranslation } from 'react-i18next'
import { Layout, Main } from '../../components/layout/Index'

const Index = ({match}) => {
    const { t } = useTranslation()

    

    return (
        <div>
            <Layout
                page={t('dokan_dashboard')}
                message={t('Welcome to dashboard')}
                container="container-fluid"
            />

            <Main>
                <p>Dashboard Index</p>
                <b>{t('HELLO_WORLD')}</b>
            </Main>
        </div>
    );
}

export default Index;