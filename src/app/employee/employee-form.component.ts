import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';


@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent {
  employeeForm!: FormGroup;
  editMode = signal(false);
  editId!: number;

  constructor(
    private fb: FormBuilder,
    private service: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: [''],
      department: [''],
      country: [''],
      city: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode.set(true);
      this.editId = +id;
      const emp = this.service.getById(this.editId);
      if (emp) this.employeeForm.patchValue(emp);
    }
  }

  submit() {
    const value = this.employeeForm.value;

    if (this.editMode()) {
      this.service.updateEmployee({ ...value, id: this.editId });
    } else {
      this.service.addEmployee(value);
    }

    this.router.navigate(['/employees']);
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
