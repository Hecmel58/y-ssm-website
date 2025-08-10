document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const agreementLink = document.getElementById('openAgreement');
    const agreementModal = document.getElementById('agreementModal');
    const closeAgreement = document.getElementById('closeAgreement');
    const mainApp = document.getElementById('mainApp');
    const loginContainer = document.querySelector('.login-container');

    agreementLink.addEventListener('click', (e) => {
        e.preventDefault();
        agreementModal.style.display = 'block';
    });

    closeAgreement.addEventListener('click', () => {
        agreementModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === agreementModal) {
            agreementModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('loginPhone').value;
        const password = document.getElementById('loginPassword').value;
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });
        const data = await res.json();
        if (data.ok) {
            loginContainer.style.display = 'none';
            mainApp.style.display = 'block';
            loadMainUI();
        } else {
            alert(data.message);
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!document.getElementById('agreementCheckbox').checked) {
            alert("Kullanıcı sözleşmesini onaylamalısınız.");
            return;
        }
        const name = document.getElementById('registerName').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, password })
        });
        const data = await res.json();
        if (data.ok) {
            alert("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
        } else {
            alert(data.message);
        }
    });

    async function loadMainUI() {
        const navRes = await fetch('components/navigation.html');
        const navHtml = await navRes.text();
        document.getElementById('navigation').innerHTML = navHtml;

        const modalsRes = await fetch('components/modals.html');
        const modalsHtml = await modalsRes.text();
        document.body.insertAdjacentHTML('beforeend', modalsHtml);
    }
});
