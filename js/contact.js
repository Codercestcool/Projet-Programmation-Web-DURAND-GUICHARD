document.addEventListener('DOMContentLoaded', function () {
    try {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const fields = {
            name: form.querySelector('#name'),
            email: form.querySelector('#email'),
            subject: form.querySelector('#subject'),
            message: form.querySelector('#message')
        };

        function createErrorEl(field) {
            let el = field.parentNode.querySelector('.field-error');
            if (!el) {
                el = document.createElement('div');
                el.className = 'field-error';
                el.setAttribute('aria-live', 'polite');
                field.parentNode.appendChild(el);
            }
            return el;
        }

        function setError(field, msg) {
            const el = createErrorEl(field);
            el.textContent = msg;
            field.setAttribute('aria-invalid', 'true');
        }

        function clearError(field) {
            const el = field.parentNode.querySelector('.field-error');
            if (el) el.textContent = '';
            field.removeAttribute('aria-invalid');
        }

        function validate() {
            let ok = true;
            // Validation du nom
            if (!fields.name.value || fields.name.value.trim().length < 2) {
                setError(fields.name, 'Veuillez saisir au moins 2 caractères pour le nom.');
                ok = false;
            } else clearError(fields.name);

            // Validation de l'adresse email
            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!fields.email.value || !emailRe.test(fields.email.value.trim())) {
                setError(fields.email, 'Veuillez saisir une adresse email valide.');
                ok = false;
            } else clearError(fields.email);

            // Validation du sujet
            if (!fields.subject.value || fields.subject.value.trim().length === 0) {
                setError(fields.subject, 'Veuillez indiquer un sujet.');
                ok = false;
            } else clearError(fields.subject);

            // Validation du message
            if (!fields.message.value || fields.message.value.trim().length < 20) {
                setError(fields.message, 'Le message doit contenir au moins 20 caractères.');
                ok = false;
            } else clearError(fields.message);

            return ok;
        }

        function showSuccess() {
            const msgDiv = document.getElementById('form-message');
            if (!msgDiv) return;
            msgDiv.className = 'success-message';
            msgDiv.textContent = '✓ Merci — votre message a été enregistré localement (aucun envoi).';
            msgDiv.setAttribute('role', 'status');
            setTimeout(() => {
                msgDiv.textContent = '';
                msgDiv.className = '';
            }, 5000);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validate()) return;
            // Aucun envoi réel : afficher la confirmation puis réinitialiser le formulaire
            showSuccess();
            form.reset();
            Object.values(fields).forEach(clearError);
        });

    } catch (err) {
        console.error('contact.js error', err);
    }
});