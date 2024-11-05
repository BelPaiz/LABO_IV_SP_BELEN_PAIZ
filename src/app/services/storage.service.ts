import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  SubirImagen($event: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const file = $event.target.files[0];
      if (!file) {
        reject('No se seleccionó ningún archivo.');
        return;
      }

      const maxSizeInBytes = 0.5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        reject(`El archivo excede el tamaño máximo de  512 KB.`);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }
}
