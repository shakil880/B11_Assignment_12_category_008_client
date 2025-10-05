const FeaturesSection = () => {
  const features = [
    {
      icon: '🏠',
      title: 'Wide Property Selection',
      description: 'Choose from thousands of verified properties across different locations and price ranges.'
    },
    {
      icon: '🔒',
      title: 'Secure Transactions',
      description: 'All transactions are protected with bank-level security and verified agent network.'
    },
    {
      icon: '💼',
      title: 'Expert Agents',
      description: 'Work with certified real estate professionals who understand your needs.'
    },
    {
      icon: '📱',
      title: 'Easy Management',
      description: 'Manage your properties, offers, and communications from one dashboard.'
    },
    {
      icon: '⭐',
      title: 'Customer Reviews',
      description: 'Read authentic reviews from real customers to make informed decisions.'
    },
    {
      icon: '🚀',
      title: 'Fast Processing',
      description: 'Quick property listing approval and streamlined buying process.'
    }
  ];

  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="section-title">
          <h2>Why Choose Elite Properties?</h2>
          <p className="text-gray-600">We provide comprehensive real estate solutions</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;