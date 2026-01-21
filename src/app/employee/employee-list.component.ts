import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';

@Component({
  standalone: true,
  selector: 'app-employee-list',
  imports: [CommonModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent {
  employees = signal<Employee[]>([]);

  constructor(
    private empService: EmployeeService,
    private router: Router
  ) {
    this.loadEmployees();
  }

  loadEmployees() {
    this.empService.getEmployees().subscribe(data => this.employees.set(data));
  }

  addEmployee() {
    this.router.navigate(['/employees/add']);
  }

  editEmployee(id: number) {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure?')) {
      this.empService.deleteEmployee(id);
      this.loadEmployees();
    }
  }
}
