
import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';

interface Transaction {
  tradeId: number;
  securityCode: string;
  quantity: number;
  action: 'INSERT' | 'UPDATE' | 'CANCEL';
  tradeType: 'BUY' | 'SELL';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    NgFor,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  transaction: Transaction = {
    tradeId: 0,
    securityCode: '',
    quantity: 0,
    action: 'INSERT',
    tradeType: 'BUY'
  };

  positions = signal<{ [key: string]: number }>({});

  constructor(private http: HttpClient) {
    this.fetchPositions();
  }

  errorMessage: string = '';

  submitTransaction() {
    this.http.post('/api/transactions', this.transaction).subscribe({
      next: () => {
        this.fetchPositions();
        this.errorMessage = ''; // Clear error on success
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Unexpected error occurred';
      }
    });
  }

  fetchPositions() {
    this.http.get<{ [key: string]: number }>('/api/transactions/positions')
      .subscribe(data => this.positions.set(data));
  }

  keys(obj: any): string[] {
    return Object.keys(obj);
  }
  
}
