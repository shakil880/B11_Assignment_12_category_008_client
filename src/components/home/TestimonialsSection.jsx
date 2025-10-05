const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Buyer',
      image: '/testimonial-1.jpg',
      content: 'Elite Properties made my home buying journey incredibly smooth. The agents were professional and helped me find exactly what I was looking for.'
    },
    {
      name: 'Michael Chen',
      role: 'Real Estate Agent',
      image: '/testimonial-2.jpg',
      content: 'As an agent, this platform has revolutionized how I manage my listings and connect with potential buyers. Highly recommended!'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Property Investor',
      image: '/testimonial-3.jpg',
      content: 'The comprehensive dashboard and market insights have been invaluable for my investment decisions. Great platform!'
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h2>Success Stories</h2>
          <p className="text-gray-600">Hear from our satisfied clients</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <img 
                  src={testimonial.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=667eea&color=fff&size=64`} 
                  alt={testimonial.name}
                  className="testimonial-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=667eea&color=fff&size=64`;
                  }}
                />
                <div className="testimonial-info">
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
              <p className="testimonial-content">
                "{testimonial.content}"
              </p>
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="star-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;