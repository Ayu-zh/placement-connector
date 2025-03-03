
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const placementData = [
  { company: "Microsoft", placed: 45, averageSalary: 2400000, highestSalary: 3500000 },
  { company: "Amazon", placed: 32, averageSalary: 2200000, highestSalary: 3000000 },
  { company: "Google", placed: 18, averageSalary: 2800000, highestSalary: 4000000 },
  { company: "Meta", placed: 25, averageSalary: 2500000, highestSalary: 3200000 },
  { company: "Goldman Sachs", placed: 30, averageSalary: 2100000, highestSalary: 2800000 }
];

const hiringTrends = [
  { year: '2020', students: 180 },
  { year: '2021', students: 240 },
  { year: '2022', students: 300 },
  { year: '2023', students: 320 },
  { year: '2024', students: 350 },
];

const departmentData = [
  { name: 'Computer Science', value: 45 },
  { name: 'Electronics', value: 25 },
  { name: 'Mechanical', value: 15 },
  { name: 'Civil', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#8E9196'];

const Statistics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Placement Statistics</h1>
        <p className="text-zinc-500">
          View placement trends and analytics
        </p>
      </div>

      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="companies" className="space-y-4">
          <h2 className="text-xl font-semibold mt-4">Companies Currently Hiring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placementData.map((company) => (
              <Card key={company.company}>
                <CardHeader className="pb-2">
                  <CardTitle>{company.company}</CardTitle>
                  <CardDescription>Placement Statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Students Placed:</span>
                      <span className="font-medium">{company.placed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Salary:</span>
                      <span className="font-medium">₹{(company.averageSalary/100000).toFixed(1)} LPA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Highest Salary:</span>
                      <span className="font-medium">₹{(company.highestSalary/100000).toFixed(1)} LPA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Placement Statistics by Company</CardTitle>
              <CardDescription>Number of students placed in each company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={placementData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="company" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} students`, 'Placed']} />
                    <Legend />
                    <Bar dataKey="placed" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Placement Trends</CardTitle>
              <CardDescription>Yearly placement data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hiringTrends}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} students`, 'Placed']} />
                    <Legend />
                    <Bar dataKey="students" fill="#D946EF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Placement</CardTitle>
              <CardDescription>Percentage of students placed by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} %`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
