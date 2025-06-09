// src/lib/alert.ts
import Swal from 'sweetalert2';

export const alertSuccess = (message: string, title = 'Sucesso') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonColor: '#3085d6',
  });
};

export const alertError = (message: string, title = 'Erro') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonColor: '#d33',
  });
};

export const alertConfirm = async (message: string, title = 'Tem certeza?') => {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });

  return result.isConfirmed;
};

export const alertWarning = (message: string, title = 'Aviso') => {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f0ad4e',
    });
};
