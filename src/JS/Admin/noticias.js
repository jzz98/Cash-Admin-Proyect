$(document).ready(function () {
    // Tab switching functionality
    $('.tab-btn').click(function () {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        const tabId = $(this).data('tab');
        $('.tab-content').removeClass('active');
        $('#' + tabId).addClass('active');
    });

    // Image preview
    $('#imagen').change(function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#imagen-preview').removeClass('hidden');
                $('#imagen-preview img').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // Generate image with AI
    $('#generar-imagen').click(function () {
        $('#loading-state').removeClass('hidden');

        // Simulating AI API call
        setTimeout(function () {
            $('#loading-state').addClass('hidden');
            $('#imagen-preview').removeClass('hidden');
            $('#imagen-preview img').attr('src', 'https://via.placeholder.com/800x400/4a90e2/ffffff?text=Imagen+Generada+por+IA');
        }, 2000);
    });

    // Refresh transactions
    $('#refresh-transactions').click(function () {
        $(this).html('<i class="fas fa-spinner fa-spin text-blue-400"></i>');

        // Simulating API call
        setTimeout(function () {
            $('#refresh-transactions').html('<i class="fas fa-sync-alt text-blue-400"></i>');
            // Data would be refreshed here in a real implementation
        }, 1000);
    });

    // Load more users
    $('#load-more-users').click(function () {
        $(this).html('<i class="fas fa-spinner fa-spin mr-2"></i>Cargando...');

        // Simulating API call
        setTimeout(function () {
            $('#load-more-users').html('<i class="fas fa-users mr-2"></i>Cargar más usuarios');
            // More users would be loaded here in a real implementation
        }, 1000);
    });

    // Search functionality for transactions
    $('#search-transactions').on('keyup', function () {
        // This would filter the transactions in a real implementation
    });

    // Search functionality for users
    $('#search-users').on('keyup', function () {
        // This would filter the users in a real implementation
    });
});