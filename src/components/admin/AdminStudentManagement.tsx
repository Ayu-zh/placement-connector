
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Edit, Trash2, Search, Plus, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { Student } from '@/types/backend';

export function AdminStudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempStudent, setTempStudent] = useState<Partial<Student>>({});
  const [password, setPassword] = useState('');

  // Load students from API
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setIsLoading(true);
        const data = await ApiService.students.getAll();
        setStudents(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStudents();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewStudent = () => {
    setCurrentStudent(null);
    setTempStudent({});
    setPassword('');
    setEditDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setCurrentStudent(student);
    setTempStudent({ ...student });
    setPassword('');
    setEditDialogOpen(true);
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await ApiService.students.delete(id);
      setStudents(students.filter(student => student.id !== id));
      toast({
        title: "Student Removed",
        description: "The student has been successfully removed from the system.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleToggleVerification = async (student: Student) => {
    try {
      const updatedStudent = await ApiService.students.toggleVerification(student.id);
      setStudents(students.map(s => s.id === student.id ? updatedStudent : s));
      
      toast({
        title: student.verified ? "Verification Removed" : "Student Verified",
        description: `${student.name} is now ${student.verified ? 'unverified' : 'verified'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleSaveStudent = async () => {
    if (!tempStudent.name || !tempStudent.email || !tempStudent.department) {
      toast({
        title: "Error",
        description: "Name, email and department are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentStudent) {
        // Edit existing student
        const updatedStudent = await ApiService.students.update(
          { ...currentStudent, ...tempStudent as Student },
          password || undefined // Only update password if provided
        );
        setStudents(students.map(student => student.id === currentStudent.id ? updatedStudent : student));
        toast({
          title: "Student Updated",
          description: "The student information has been successfully updated.",
        });
      } else {
        // Add new student
        if (!password) {
          toast({
            title: "Error",
            description: "Password is required for new students.",
            variant: "destructive",
          });
          return;
        }
        
        const newStudent = await ApiService.students.add(
          {
            name: tempStudent.name || '',
            email: tempStudent.email || '',
            department: tempStudent.department || '',
            year: tempStudent.year || '1st Year',
            status: tempStudent.status as 'active' || 'active',
            verified: tempStudent.verified || false,
          },
          password
        );
        setStudents([...students, newStudent]);
        toast({
          title: "Student Added",
          description: "The new student has been successfully added to the system.",
        });
      }
      
      setEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save student",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Student Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button onClick={handleAddNewStudent}>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading students...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.year}</TableCell>
                      <TableCell>
                        <Badge variant={
                          student.status === 'active' ? 'default' : 
                          student.status === 'inactive' ? 'secondary' : 
                          'destructive'
                        }>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {student.verified ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleVerification(student)}
                          title={student.verified ? "Remove verification" : "Verify student"}
                        >
                          {student.verified ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStudent(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No students found. Try a different search term or add a new student.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentStudent ? `Edit Student: ${currentStudent.name}` : 'Add New Student'}
            </DialogTitle>
            <DialogDescription>
              Fill in the student details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">Full Name</label>
                <Input
                  id="name"
                  value={tempStudent.name || ''}
                  onChange={(e) => setTempStudent({ ...tempStudent, name: e.target.value })}
                  placeholder="Enter student name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={tempStudent.email || ''}
                  onChange={(e) => setTempStudent({ ...tempStudent, email: e.target.value })}
                  placeholder="student@college.edu"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium leading-none">Department</label>
                <Select 
                  value={tempStudent.department} 
                  onValueChange={(value) => setTempStudent({ ...tempStudent, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium leading-none">Year</label>
                <Select 
                  value={tempStudent.year} 
                  onValueChange={(value) => setTempStudent({ ...tempStudent, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium leading-none">Status</label>
                <Select 
                  value={tempStudent.status} 
                  onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                    setTempStudent({ ...tempStudent, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="verified" className="text-sm font-medium leading-none">Verified</label>
                <Select 
                  value={tempStudent.verified ? "true" : "false"} 
                  onValueChange={(value) => 
                    setTempStudent({ ...tempStudent, verified: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select verification status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Verified</SelectItem>
                    <SelectItem value="false">Not Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                {currentStudent ? 'Password (leave blank to keep current)' : 'Password'}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={currentStudent ? '••••••••' : 'Create password'}
                required={!currentStudent}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStudent}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
