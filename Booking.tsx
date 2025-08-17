import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, User, Phone, Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Booking = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    hectares: "",
    message: "",
  });

  const services = [
    { value: "land-prep", label: "Land Preparation", price: "From GH₵ 500/hectare" },
    { value: "planting", label: "Planting Services", price: "From GH₵ 300/hectare" },
    { value: "harvesting", label: "Harvesting", price: "From GH₵ 200/hectare" },
    { value: "quality-testing", label: "Quality Testing", price: "GH₵ 150/sample" },
    { value: "organic-cert", label: "Organic Certification", price: "GH₵ 1,500" },
    { value: "rspo-cert", label: "RSPO Certification", price: "GH₵ 2,500" },
    { value: "farm-management", label: "Farm Management Consultation", price: "GH₵ 500/session" },
    { value: "business-planning", label: "Business Planning", price: "GH₵ 800/plan" },
    { value: "training", label: "Technical Training", price: "GH₵ 200/person" },
  ];

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService) {
      toast({
        title: "Missing Information",
        description: "Please select a service, date, and time for your booking.",
        variant: "destructive",
      });
      return;
    }

    // Simulate booking submission
    toast({
      title: "Booking Confirmed!",
      description: `Your ${services.find(s => s.value === selectedService)?.label} appointment is scheduled for ${format(selectedDate, "PPP")} at ${selectedTime}.`,
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      hectares: "",
      message: "",
    });
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedService("");
  };

  const selectedServiceDetails = services.find(s => s.value === selectedService);

  return (
    <div className="py-12">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Book Our Services</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Schedule your agricultural service appointment with our expert team. 
            Choose your preferred date, time, and service type.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2 text-primary" />
                  Step 1: Select Service
                </CardTitle>
                <CardDescription>
                  Choose the service you would like to book
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div
                      key={service.value}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                        selectedService === service.value
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedService(service.value)}
                    >
                      <div className="font-semibold">{service.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{service.price}</div>
                    </div>
                  ))}
                </div>
                {selectedServiceDetails && (
                  <div className="mt-4 p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Selected: {selectedServiceDetails.label}</span>
                      <Badge>{selectedServiceDetails.price}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-6 w-6 mr-2 text-primary" />
                  Step 2: Choose Date & Time
                </CardTitle>
                <CardDescription>
                  Select your preferred appointment date and time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Date Picker */}
                  <div>
                    <Label className="text-base font-medium">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-2",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <Label className="text-base font-medium">Select Time</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="text-xs"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center text-primary">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-semibold">
                        Appointment scheduled for {format(selectedDate, "PPP")} at {selectedTime}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-6 w-6 mr-2 text-primary" />
                  Step 3: Your Information
                </CardTitle>
                <CardDescription>
                  Provide your contact details and project information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+233 123 456 789"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Farm Location *</Label>
                    <Input
                      id="location"
                      placeholder="City, Region"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hectares">Farm Size (Hectares)</Label>
                  <Input
                    id="hectares"
                    placeholder="e.g., 5.5"
                    value={formData.hectares}
                    onChange={(e) => handleInputChange("hectares", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your specific needs, current challenges, or any special requirements..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit" 
                size="lg" 
                className="px-12"
                disabled={!selectedDate || !selectedTime || !selectedService}
              >
                Confirm Booking
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                You will receive a confirmation email within 24 hours
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Booking;