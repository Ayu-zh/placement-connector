
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

// Mock data for statistics
const initialCompanyData = [
  { company: "Microsoft", placed: 45, averageSalary: 2400000, highestSalary: 3500000 },
  { company: "Amazon", placed: 32, averageSalary: 2200000, highestSalary: 3000000 },
  { company: "Google", placed: 18, averageSalary: 2800000, highestSalary: 4000000 },
  { company: "Meta", placed: 25, averageSalary: 2500000, highestSalary: 3200000 },
  { company: "Goldman Sachs", placed: 30, averageSalary: 2100000, highestSalary: 2800000 }
];

const initialTrendsData = [
  { year: '2020', students: 180 },
  { year: '2021', students: 240 },
  { year: '2022', students: 300 },
  { year: '2023', students: 320 },
  { year: '2024', students: 350 },
];

const initialDepartmentData = [
  { name: 'Computer Science', value: 45 },
  { name: 'Electronics', value: 25 },
  { name: 'Mechanical', value: 15 },
  { name: 'Civil', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#8E9196'];

export function AdminStatistics() {
  const [activeTab, setActiveTab] = useState('companies');
  const [companyData, setCompanyData] = useState(initialCompanyData);
  const [trendsData, setTrendsData] = useState(initialTrendsData);
  const [departmentData, setDepartmentData] = useState(initialDepartmentData);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [tempCompanyValues, setTempCompanyValues] = useState<{
    placed?: number;
    averageSalary?: number;
    highestSalary?: number;
  }>({});

  const [editingTrendYear, setEditingTrendYear] = useState<string | null>(null);
  const [tempTrendValue, setTempTrendValue] = useState<number | null>(null);

  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [tempDepartmentValue, setTempDepartmentValue] = useState<number | null>(null);

  const handleEditCompany = (company: string) => {
    const companyItem = companyData.find(item => item.company === company);
    if (companyItem) {
      setEditingCompany(company);
      setTempCompanyValues({
        placed: companyItem.placed,
        averageSalary: companyItem.averageSalary,
        highestSalary: companyItem.highestSalary,
      });
    }
  };

  const handleSaveCompany = () => {
    if (!editingCompany) return;

    setCompanyData(companyData.map(item => 
      item.company === editingCompany
        ? { 
            ...item, 
            placed: tempCompanyValues.placed ?? item.placed,
            averageSalary: tempCompanyValues.averageSalary ?? item.averageSalary,
            highestSalary: tempCompanyValues.highestSalary ?? item.highestSalary,
          }
        : item
    ));

    setEditingCompany(null);
    setTempCompanyValues({});
    
    toast({
      title: "Data Updated",
      description: `Statistics for ${editingCompany} have been updated.`,
    });
  };

  const handleEditTrend = (year: string) => {
    const yearData = trendsData.find(item => item.year === year);
    if (yearData) {
      setEditingTrendYear(year);
      setTempTrendValue(yearData.students);
    }
  };

  const handleSaveTrend = () => {
    if (!editingTrendYear || tempTrendValue === null) return;

    setTrendsData(trendsData.map(item => 
      item.year === editingTrendYear
        ? { ...item, students: tempTrendValue }
        : item
    ));

    setEditingTrendYear(null);
    setTempTrendValue(null);
    
    toast({
      title: "Trend Updated",
      description: `Statistics for year ${editingTrendYear} have been updated.`,
    });
  };

  const handleEditDepartment = (name: string) => {
    const deptData = departmentData.find(item => item.name === name);
    if (deptData) {
      setEditingDepartment(name);
      setTempDepartmentValue(deptData.value);
    }
  };

  const handleSaveDepartment = () => {
    if (!editingDepartment || tempDepartmentValue === null) return;

    setDepartmentData(departmentData.map(item => 
      item.name === editingDepartment
        ? { ...item, value: tempDepartmentValue }
        : item
    ));

    setEditingDepartment(null);
    setTempDepartmentValue(null);
    
    toast({
      title: "Department Data Updated",
      description: `Statistics for ${editingDepartment} department have been updated.`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Placement Statistics</CardTitle>
            <CardDescription>
              Edit and manage placement statistics
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="companies" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>
            
            {/* Companies Tab */}
            <TabsContent value="companies" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Companies Statistics</CardTitle>
                    <CardDescription>Edit placement statistics by company</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {companyData.map((company) => (
                        <div key={company.company} className="rounded-lg border p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">{company.company}</h3>
                            {editingCompany === company.company ? (
                              <div className="space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => setEditingCompany(null)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={handleSaveCompany}
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCompany(company.company)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Students Placed</p>
                              {editingCompany === company.company ? (
                                <Input
                                  type="number"
                                  value={tempCompanyValues.placed}
                                  onChange={(e) => setTempCompanyValues({
                                    ...tempCompanyValues,
                                    placed: parseInt(e.target.value) || 0
                                  })}
                                />
                              ) : (
                                <p className="font-medium">{company.placed}</p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Average Salary</p>
                              {editingCompany === company.company ? (
                                <Input
                                  type="number"
                                  value={tempCompanyValues.averageSalary}
                                  onChange={(e) => setTempCompanyValues({
                                    ...tempCompanyValues,
                                    averageSalary: parseInt(e.target.value) || 0
                                  })}
                                />
                              ) : (
                                <p className="font-medium">₹{(company.averageSalary/100000).toFixed(1)} LPA</p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Highest Salary</p>
                              {editingCompany === company.company ? (
                                <Input
                                  type="number"
                                  value={tempCompanyValues.highestSalary}
                                  onChange={(e) => setTempCompanyValues({
                                    ...tempCompanyValues,
                                    highestSalary: parseInt(e.target.value) || 0
                                  })}
                                />
                              ) : (
                                <p className="font-medium">₹{(company.highestSalary/100000).toFixed(1)} LPA</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Company Placement Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={companyData}
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
              </div>
            </TabsContent>
            
            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Yearly Placement Trends</CardTitle>
                  <CardDescription>Edit yearly placement data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendsData.map((yearData) => (
                      <div key={yearData.year} className="rounded-lg border p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">Year: {yearData.year}</h3>
                          {editingTrendYear === yearData.year ? (
                            <div className="space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingTrendYear(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm"
                                onClick={handleSaveTrend}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditTrend(yearData.year)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>

                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Students Placed</p>
                          {editingTrendYear === yearData.year ? (
                            <Input
                              type="number"
                              value={tempTrendValue !== null ? tempTrendValue : ''}
                              onChange={(e) => setTempTrendValue(parseInt(e.target.value) || 0)}
                              className="w-full md:w-1/3 mt-1"
                            />
                          ) : (
                            <p className="font-medium">{yearData.students} students</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-[400px] mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={trendsData}
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
            
            {/* Departments Tab */}
            <TabsContent value="departments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department-wise Placement</CardTitle>
                  <CardDescription>Edit department placement percentages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentData.map((dept) => (
                      <div key={dept.name} className="rounded-lg border p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{dept.name}</h3>
                          {editingDepartment === dept.name ? (
                            <div className="space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingDepartment(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm"
                                onClick={handleSaveDepartment}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditDepartment(dept.name)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>

                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Placement Percentage</p>
                          {editingDepartment === dept.name ? (
                            <Input
                              type="number"
                              value={tempDepartmentValue !== null ? tempDepartmentValue : ''}
                              onChange={(e) => setTempDepartmentValue(parseInt(e.target.value) || 0)}
                              className="w-full md:w-1/3 mt-1"
                            />
                          ) : (
                            <p className="font-medium">{dept.value}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-[400px] mt-8 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
