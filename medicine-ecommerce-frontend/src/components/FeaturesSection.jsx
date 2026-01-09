import React from 'react';

const FeaturesSection = () => {
    const features = [
        { icon: '🚚', title: 'Fast Delivery', desc: 'Across all major cities' },
        { icon: '🛡️', title: 'Secure Payment', desc: '100% secure transactions' },
        { icon: '👨‍⚕️', title: 'Expert Support', desc: '24/7 access to pharmacists' },
        { icon: '🏷️', title: 'Best Prices', desc: 'Guaranteed low costs' }
    ];

    return (
        <div className="features-section" style={{ padding: '60px 0', background: '#f8f9fa' }}>
            <div className="container">
                <div className="grid grid-4">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" style={{
                            textAlign: 'center',
                            padding: '20px',
                            border: '1px solid #eee',
                            borderRadius: '12px',
                            background: 'white',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{feature.icon}</div>
                            <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>{feature.title}</h3>
                            <p style={{ color: '#7f8c8d' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
