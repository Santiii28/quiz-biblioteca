import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibroService } from './libro.service';
import { Libro } from './libro.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private libroService = inject(LibroService);

  libros: Libro[] = [];
  titulo = '';
  autor = '';
  mensaje = '';
  error = '';

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.libroService.listar().subscribe({
      next: (datos) => {
        this.libros = datos;
        this.error = '';
      },
      error: () => {
        this.error = 'No se pudo conectar con el backend en el puerto 3000.';
      }
    });
  }

  crearLibro(): void {
    const titulo = this.titulo.trim();
    const autor = this.autor.trim();

    if (!titulo || !autor) {
      this.error = 'Debes escribir el título y el autor.';
      this.mensaje = '';
      return;
    }

    this.libroService.crear({ titulo, autor }).subscribe({
      next: (nuevo) => {
        this.libros = [...this.libros, nuevo];
        this.titulo = '';
        this.autor = '';
        this.error = '';
        this.mensaje = 'Libro creado correctamente (201).';
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo crear el libro.';
        this.mensaje = '';
      }
    });
  }

  eliminarLibro(id: number): void {
    this.libroService.eliminar(id).subscribe({
      next: () => {
        this.libros = this.libros.filter((libro) => libro.id !== id);
        this.error = '';
        this.mensaje = 'Libro eliminado correctamente (204).';
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo eliminar el libro.';
        this.mensaje = '';
      }
    });
  }
}
