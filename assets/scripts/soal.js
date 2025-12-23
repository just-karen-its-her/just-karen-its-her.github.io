function cekJawaban() {
    let score = 0;
    const totalSoal = 3;
    const bobot = 100 / totalSoal;

    // Ambil semua elemen soal
    const soalCards = document.querySelectorAll('.soal-card');

    soalCards.forEach((card) => {
        // Ambil jawaban yang benar dari atribut data-jawaban
        const kunci = card.getAttribute('data-jawaban');

        // Cari input radio yang dipilih user dalam kartu ini
        const inputDipilih = card.querySelector('input[type="radio"]:checked');
        const feedbackDiv = card.querySelector('.feedback');
        const pembahasanDiv = card.querySelector('.pembahasan');

        // Reset class tampilan sebelumnya
        card.classList.remove('benar', 'salah');
        pembahasanDiv.classList.remove('hidden'); // Tampilkan pembahasan

        if (inputDipilih) {
            if (inputDipilih.value === kunci) {
                // JIKA BENAR
                score += bobot;
                card.classList.add('benar');
                feedbackDiv.innerHTML = '<span style="color: #2ecc71;">✓ Jawaban Benar!</span>';
            } else {
                // JIKA SALAH
                card.classList.add('salah');
                feedbackDiv.innerHTML = '<span style="color: #e74c3c;">✕ Jawaban Salah.</span>';
            }
        } else {
            // JIKA TIDAK DIISI
            card.classList.add('salah');
            feedbackDiv.innerHTML = '<span style="color: #e74c3c;">✕ Anda belum memilih jawaban.</span>';
        }
    });

    // Tampilkan Skor Akhir
    const hasilDiv = document.getElementById('hasil-nilai');
    const skorSpan = document.getElementById('skor-akhir');

    // Pembulatan skor biar tidak koma panjang
    skorSpan.innerText = Math.round(score);
    hasilDiv.style.display = 'block';

    // Scroll otomatis ke bagian nilai
    hasilDiv.scrollIntoView({ behavior: 'smooth' });
}