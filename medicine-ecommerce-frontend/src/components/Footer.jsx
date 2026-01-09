import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer style={{
            background: '#f8f9fa',
            padding: '20px',
            textAlign: 'center',
            color: '#6c757d',
            borderTop: '1px solid #dee2e6',
            marginTop: 'auto'
        }}>
            <div className="container">
                <p>{t('lblCopyright')}</p>
            </div>
        </footer>
    );
};

export default Footer;
