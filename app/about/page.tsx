import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Changed from blue gradient to black gradient */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About LocatePro</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Empowering businesses with location intelligence to make smarter decisions
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-lg mb-4 text-gray-700">
              LocatePro is a cutting-edge platform that helps businesses find the optimal location 
              for their operations using advanced data analytics and geospatial intelligence.
            </p>
            <p className="text-lg text-gray-700">
              Our mission is to empower businesses with data-driven insights to make better location decisions,
              reducing risk and maximizing potential for success.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <div className="relative h-80 w-full">
              <Image 
                src="/images/plan.jpg" 
                alt="Our Mission" 
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-1 md:order-none">
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/Applications-Of-Satellite-Imagery.jpg" 
                alt="Our Technology" 
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Technology</h2>
            <p className="text-lg mb-4 text-gray-700">
              We combine multiple data sources including demographic information, foot traffic patterns, 
              nighttime light data, competitor analysis, and economic indicators to provide a comprehensive 
              view of potential business locations.
            </p>
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              <li>Advanced geospatial analytics</li>
              <li>Machine learning-powered recommendations</li>
              <li>Real-time market trend analysis</li>
              <li>Competitive landscape visualization</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rusham Elahi", role: "Chief Data Scientist", image: "/images/rusham.jpg" },
              { name: "Rusham Elahi", role: "Urban Planning Expert", image: "/images/rusham.jpg" },
              { name: "Rusham Elahi", role: "GIS Specialist", image: "/images/rusham.jpg" }
            ].map((member, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Data-Driven", description: "We base all our recommendations on solid data and analytics, not guesswork." },
              { title: "Innovation", description: "We're constantly evolving our technology to provide the best insights possible." },
              { title: "Client Success", description: "Your success is our success. We're partners in your business growth journey." }
            ].map((value, idx) => (
              <div key={idx} className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
