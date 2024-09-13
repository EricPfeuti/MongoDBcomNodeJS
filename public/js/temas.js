const chk = document.getElementById('chk');
const isDarkMode = localStorage.getItem('dark-mode') === 'true';

if (isDarkMode) {
    document.body.classList.add('dark-mode');
    chk.checked = true;
}

chk.addEventListener('change', function () {
    if (chk.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', 'false');
    }
});
