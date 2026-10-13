import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro, NuevoLibro } from './libro.model';

@Injectable({ providedIn: 'root' })
export class LibroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/libros';

  listar(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  crear(libro: NuevoLibro): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
