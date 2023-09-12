import Swal from 'sweetalert2';

export const alert = ( type ) => {

    Swal.fire({
      title: 'Error!',
      text: type === 'register' ? 'Wrong register data' : 'User not found',
      icon: 'error',
      confirmButtonText: 'Try again'
    });

};