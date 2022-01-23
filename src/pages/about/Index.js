import React from 'react'
import { ArrowLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container } from '../../components/container/Index'
import { GrayButton } from '../../components/button/Index'
import { Layout, Main } from '../../components/layout/Index'

const Index = () => {
    const { t } = useTranslation()
    return (
        <div>
            <Layout
                page={t("about")}
                message={t("About Us")}
                container="container-fluid"
                button={
                    <Link to="/dashboard/settings">
                        <GrayButton
                            type="button"
                            className="px-3"
                        >
                            <ArrowLeft size={15} style={{ marginRight: 5 }} />
                            <span style={{ fontSize: 13 }}>BACK</span>
                        </GrayButton>
                    </Link>
                }
            />

            <Main>
                <Container.Column>

                    <h6>{t("What is Lorem Ipsum?")}</h6>
                    <p style={{ lineHeight: "1.6rem", fontSize: 15 }}>
                        {t("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </p>

                    <h6>{t("What is Lorem Ipsum?")}</h6>
                    <p style={{ lineHeight: "1.6rem", fontSize: 15 }}>
                        {t("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </p>

                    <h6>{t("What is Lorem Ipsum?")}</h6>
                    <p style={{ lineHeight: "1.6rem", fontSize: 15 }}>
                        {t("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </p>

                    <h6>{t("What is Lorem Ipsum?")}</h6>
                    <p style={{ lineHeight: "1.6rem", fontSize: 15 }}>
                        {t("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </p>

                    <h6>{t("What is Lorem Ipsum?")}</h6>
                    <p style={{ lineHeight: "1.6rem", fontSize: 15 }}>
                        {t("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </p>

                    <h6>{t("What is Lorem Ipsum?")}</h6>
                    <p style={{ lineHeight: "1.6rem", fontSize: 15 }}>
                        {t("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </p>

                    <h6>{t("What is Lorem Ipsum?")}</h6>
                    <p style={{ lineHeight: "1.6rem", fontSize: 15 }}>
                        {t("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </p>
                </Container.Column>
            </Main>
        </div>
    );
}

export default Index;