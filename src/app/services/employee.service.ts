import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable()
export class EmployeeService {
  private employees: Employee[] = [
    { id: 1, 
      name: 'Chandan Ghosh', 
      email: 'chandan21@gmail.com', 
      position: 'Developer', 
      department: 'IT' , 
      country: 'Bangladesh',
      city: 'Dhaka' }
  ];

  getEmployees(): Observable<Employee[]> {
    return of(this.employees);
  }

  addEmployee(emp: Employee) {
    emp.id = this.employees.length ? Math.max(...this.employees.map(e => e.id)) + 1 : 1;
    this.employees.push(emp);
  }

  updateEmployee(emp: Employee) {
    const index = this.employees.findIndex(e => e.id === emp.id);
    if (index > -1) this.employees[index] = emp;
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter(e => e.id !== id);
  }
}
