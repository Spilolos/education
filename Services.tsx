import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  Tractor, 
  Shield, 
  Users, 
  Calendar, 
  TrendingUp,
  Award,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";

const Services = () => {
  const serviceCategories = [
    {
      icon: Tractor,
      title: "Agricultural Services",
      description: "Comprehensive farming and cultivation services",
      services: [
        {
          name: "Land Preparation",
          description: "Professional land clearing and preparation for palm oil cultivation",
          price: "From GH₵ 500/hectare",
          duration: "2-3 days",
          features: ["Soil analysis", "Land clearing", "Irrigation setup"]
        },
        {
          name: "Planting Services", 
          description: "Expert palm tree planting with high-quality seedlings",
          price: "From GH₵ 300/hectare",
          duration: "1-2 days",
          features: ["Quality seedlings", "Proper spacing", "Growth monitoring"]
        },
        {
          name: "Harvesting",
          description: "Professional harvesting services for optimal yield",
          price: "From GH₵ 200/hectare",
          duration: "1 day",
          features: ["Expert harvesting", "Quality sorting", "Transport included"]
        }
      ]
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Certification and quality control services",
      services: [
        {
          name: "Quality Testing",
          description: "Comprehensive testing of palm oil products",
          price: "GH₵ 150/sample",
          duration: "3-5 days",
          features: ["Lab testing", "Quality report", "Certification"]
        },
        {
          name: "Organic Certification",
          description: "Assistance with organic farming certification",
          price: "GH₵ 1,500",
          duration: "2-4 weeks",
          features: ["Documentation", "Inspection support", "Certification"]
        },
        {
          name: "RSPO Certification",
          description: "Roundtable on Sustainable Palm Oil certification",
          price: "GH₵ 2,500",
          duration: "4-6 weeks", 
          features: ["Sustainability audit", "Documentation", "Certification"]
        }
      ]
    },
    {
      icon: Users,
      title: "Consultation Services",
      description: "Expert advice and business consultation",
      services: [
        {
          name: "Farm Management",
          description: "Complete farm management and optimization consultation",
          price: "GH₵ 500/session",
          duration: "2-4 hours",
          features: ["Site visit", "Management plan", "Follow-up support"]
        },
        {
          name: "Business Planning",
          description: "Strategic business planning for palm oil ventures",
          price: "GH₵ 800/plan",
          duration: "1-2 weeks",
          features: ["Market analysis", "Financial planning", "Implementation guide"]
        },
        {
          name: "Technical Training",
          description: "Training programs for farmers and farm workers",
          price: "GH₵ 200/person",
          duration: "1 day",
          features: ["Hands-on training", "Materials included", "Certificate"]
        }
      ]
    }
  ];

  return (
    <div className="py-12">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Comprehensive palm oil production and marketing services designed to 
            maximize your agricultural success and profitability.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {serviceCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="text-center mb-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-glow">
                    <category.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{category.title}</h2>
                  <p className="text-xl text-muted-foreground">{category.description}</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service, serviceIndex) => (
                    <Card key={serviceIndex} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {service.name}
                          </CardTitle>
                          <Badge variant="secondary" className="ml-2">
                            {service.price}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            Duration: {service.duration}
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Includes:</h4>
                            <ul className="space-y-1">
                              {service.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Link to="/booking">
                              Book This Service
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Services?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We bring years of expertise and modern technology to every project
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Certified Experts</h3>
              <p className="text-muted-foreground text-sm">
                All our team members are certified agricultural professionals
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Proven Results</h3>
              <p className="text-muted-foreground text-sm">
                Track record of increasing yields by up to 40%
              </p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Local Expertise</h3>
              <p className="text-muted-foreground text-sm">
                Deep understanding of local climate and soil conditions
              </p>
            </div>
            <div className="text-center">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-muted-foreground text-sm">
                Services available 7 days a week to fit your schedule
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your palm oil production needs and get a 
            customized service plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/booking">Book a Service</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;