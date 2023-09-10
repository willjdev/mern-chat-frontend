import Swal from 'sweetalert2';

export const alert = () => {

    Swal.fire({
      title: 'Error!',
      text: 'User not found',
      icon: 'error',
      confirmButtonText: 'Try again'
    });

};