import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  providers: [EmployeeService]
})
export class EmployeeComponent {
  employees = signal<Employee[]>([]);
  editMode = signal(false);
  editId!: number;

  countries = ['Bangladesh', 'India', 'Sri Lanka'];

  countryCityMap: Record<string, string[]> = {
    Bangladesh: ['Dhaka', 'Tangail', 'Chattogram', 'Khulna', 'Rajshahi'],
    India: ['Delhi', 'Mumbai', 'Kolkata', 'Bangalore', 'Chennai'],
    'Sri Lanka': ['Colombo', 'Kandy', 'Galle', 'Jaffna']
  };
  cities = signal<string[]>([]);

  employeeForm: FormGroup;

  constructor(private empService: EmployeeService, private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.loadEmployees();
    this.employeeForm.get('country')?.valueChanges.subscribe(country => {
      this.cities.set(this.countryCityMap[country] || []);
      this.employeeForm.get('city')?.reset();
    });
  }
  loadEmployees() {
    this.empService.getEmployees().subscribe(data => this.employees.set(data));
  }
  submit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      if (this.editMode()) {
        this.empService.updateEmployee({ id: this.editId, ...formValue });
        this.editMode.set(false);
      } else {
        this.empService.addEmployee(formValue);
      }
      this.employeeForm.reset();
      this.cities.set([]);
      this.loadEmployees();
    }
  }
  editEmployee(emp: Employee) {
    this.editMode.set(true);
    this.editId = emp.id;
    this.employeeForm.patchValue(emp);
    this.cities.set(this.countryCityMap[emp.country] || []);
  }
  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.empService.deleteEmployee(id);
      this.loadEmployees();
    }
  }
  cancelEdit() {
    this.editMode.set(false);
    this.employeeForm.reset();
    this.cities.set([]);
  }
}
