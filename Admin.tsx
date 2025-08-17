import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Eye,
  CheckCircle,
  XCircle,
  Lock,
  UserCheck,
  BarChart3,
  Clock
} from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Mock data for demonstration
  const mockBookings = [
    {
      id: "BK001",
      customer: "John Doe",
      service: "Land Preparation",
      date: "2024-08-15",
      time: "09:00 AM",
      status: "pending",
      phone: "+233 123 456 789",
      location: "Kumasi"
    },
    {
      id: "BK002", 
      customer: "Mary Johnson",
      service: "Harvesting",
      date: "2024-08-16",
      time: "10:00 AM",
      status: "confirmed",
      phone: "+233 987 654 321",
      location: "Cape Coast"
    },
    {
      id: "BK003",
      customer: "James Wilson",
      service: "Quality Testing",
      date: "2024-08-17",
      time: "02:00 PM", 
      status: "completed",
      phone: "+233 555 123 456",
      location: "Takoradi"
    }
  ];

  const mockEnquiries = [
    {
      id: "ENQ001",
      name: "Sarah Adams",
      email: "sarah@email.com",
      type: "General Enquiry",
      subject: "Partnership Opportunities",
      date: "2024-08-10",
      status: "new"
    },
    {
      id: "ENQ002",
      name: "Robert Brown", 
      email: "robert@email.com",
      type: "Pricing & Quotes",
      subject: "Organic Certification Cost",
      date: "2024-08-12",
      status: "responded"
    }
  ];

  const stats = {
    totalBookings: 45,
    pendingBookings: 12,
    completedBookings: 28,
    totalEnquiries: 23,
    newEnquiries: 5,
    responseRate: 95
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo authentication
    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  const handleBookingAction = (bookingId: string, action: "confirm" | "complete" | "cancel") => {
    toast({
      title: "Booking Updated",
      description: `Booking ${bookingId} has been ${action}ed.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800", 
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      new: "bg-purple-100 text-purple-800",
      responded: "bg-green-100 text-green-800"
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-palm-sky to-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-glow">
              <Lock className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <UserCheck className="h-4 w-4 mr-2" />
                Login to Dashboard
              </Button>
            </form>
            <div className="mt-6 p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Credentials:</strong><br />
                Username: admin<br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="py-12">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Dashboard</h1>
              <p className="text-xl text-primary-foreground/90">
                Manage bookings, enquiries, and system analytics
              </p>
            </div>
            <Button 
              variant="outline" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-3xl font-bold">{stats.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completedBookings}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Enquiries</p>
                    <p className="text-3xl font-bold">{stats.totalEnquiries}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">New Enquiries</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.newEnquiries}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                    <p className="text-3xl font-bold text-green-600">{stats.responseRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">Service Bookings</TabsTrigger>
              <TabsTrigger value="enquiries">Customer Enquiries</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Service Bookings Management</CardTitle>
                  <CardDescription>
                    View and manage all service bookings from customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.customer}</div>
                              <div className="text-sm text-muted-foreground">{booking.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.service}</TableCell>
                          <TableCell>
                            <div>
                              <div>{booking.date}</div>
                              <div className="text-sm text-muted-foreground">{booking.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.location}</TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {booking.status === "pending" && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleBookingAction(booking.id, "confirm")}
                                >
                                  Confirm
                                </Button>
                              )}
                              {booking.status === "confirmed" && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleBookingAction(booking.id, "complete")}
                                >
                                  Complete
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enquiries Tab */}
            <TabsContent value="enquiries">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Enquiries</CardTitle>
                  <CardDescription>
                    Manage customer enquiries and support requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Enquiry ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockEnquiries.map((enquiry) => (
                        <TableRow key={enquiry.id}>
                          <TableCell className="font-medium">{enquiry.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{enquiry.name}</div>
                              <div className="text-sm text-muted-foreground">{enquiry.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{enquiry.type}</TableCell>
                          <TableCell>{enquiry.subject}</TableCell>
                          <TableCell>{enquiry.date}</TableCell>
                          <TableCell>{getStatusBadge(enquiry.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm">
                                Reply
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      System Usage Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Service Bookings This Month</span>
                        <span className="font-bold">45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>New Customer Registrations</span>
                        <span className="font-bold">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Response Time</span>
                        <span className="font-bold">2.4 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Customer Satisfaction</span>
                        <span className="font-bold">4.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Land Preparation</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-primary/20 rounded-full mr-2">
                            <div className="w-4/5 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm">80%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Harvesting</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-primary/20 rounded-full mr-2">
                            <div className="w-3/5 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm">60%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Quality Testing</span>
                        <div className="flex items-center">
                          <div className="w-20 h-2 bg-primary/20 rounded-full mr-2">
                            <div className="w-2/5 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm">40%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Admin;