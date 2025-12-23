// === KAMUS LENGKAP ===
const vocab = {
    true: [
        '1', 'true', 't', 'benar', 'betul', 'ya', 'y', 'yes', // Standar
        'on', 'high', 'hidup', 'nyala', 'aktif', 'active', '5v', 'vcc', // Elektro
        'buka', 'tekan', 'masuk', 'ada', 'valid', 'set', // Logic
        'ok', 'sip', 'mantap', 'bisa', 'positive', 'positif' // Casual
    ],
    false: [
        '0', 'false', 'f', 'salah', 'tidak', 'n', 'no', // Standar
        'off', 'low', 'mati', 'padam', 'nonaktif', 'inactive', 'gnd', 'ground', '0v', // Elektro
        'tutup', 'lepas', 'keluar', 'kosong', 'invalid', 'reset', // Logic
        'gak', 'nggak', 'bukan', 'negative', 'negatif', 'null' // Casual
    ]
};

// Database Logika
const logicData = {
    KONJUNGSI: {
        symbol: '∧',
        formula: (p, q) => `p ∧ q`,
        check: (p, q) => p && q,
        desc: ["F", "F", "F", "T"],
        rule: "Bernilai Benar hanya jika keduanya Benar."
    },
    DISJUNGSI: {
        symbol: '∨',
        formula: (p, q) => `p ∨ q`,
        check: (p, q) => p || q,
        desc: ["F", "T", "T", "T"],
        rule: "Bernilai Salah hanya jika keduanya Salah."
    },
    NEGASI: {
        symbol: '¬',
        formula: (p) => `¬p`,
        check: (p) => !p,
        desc: ["T", "F"],
        rule: "Membalikkan nilai kebenaran."
    },
    IMPLIKASI: {
        symbol: '→',
        formula: (p, q) => `p → q`,
        check: (p, q) => !p || q,
        desc: ["T", "T", "F", "T"],
        rule: "Salah jika p Benar dan q Salah."
    },
    BIIMPLIKASI: {
        symbol: '↔',
        formula: (p, q) => `p ↔ q`,
        check: (p, q) => p === q,
        desc: ["T", "F", "F", "T"],
        rule: "Benar jika nilai p dan q sama."
    },
    XOR: {
        symbol: '⊕',
        formula: (p, q) => `p ⊕ q`,
        check: (p, q) => p !== q,
        desc: ["F", "T", "T", "F"],
        rule: "Benar jika nilai p dan q berbeda."
    },
    TAUTOLOGI: {
        symbol: '∨',
        formula: (p) => `p ∨ ¬p`,
        check: (p) => true,
        desc: ["T", "T"],
        rule: "Selalu bernilai <b>BENAR (T)</b>."
    },
    KONTRADIKSI: {
        symbol: '∧',
        formula: (p) => `p ∧ ¬p`,
        check: (p) => false,
        desc: ["F", "F"],
        rule: "Selalu bernilai <b>SALAH (F)</b>."
    }
};

// === FUNGSI UTAMA ===

function resetForm() {
    document.getElementById('p').value = '';
    document.getElementById('q').value = '';
    document.getElementById('mathDisplay').innerHTML = '<span style="color:#555; font-size:1rem; font-family:\'Poppins\'">Hasil Notasi</span>';
    document.getElementById('tableContainer').innerHTML = '<div style="text-align: center; color: #555; font-style: italic; padding: 20px;">Menunggu input...</div>';
    document.getElementById('explanationContainer').innerHTML = '';
    document.getElementById('statusContainer').innerHTML = '';
    document.querySelectorAll('.btn-group button').forEach(b => b.classList.remove('active'));
}

function analyzeInput(val) {
    const cleanVal = val.toString().trim().toLowerCase();
    // Cek Kamus
    if (vocab.true.includes(cleanVal)) return { bool: true, original: val };
    if (vocab.false.includes(cleanVal)) return { bool: false, original: val };
    return null;
}

function determineProperty(op, data) {
    let allTrue = true;
    let allFalse = true;
    const steps = (op === 'NEGASI' || op === 'TAUTOLOGI' || op === 'KONTRADIKSI') ? 2 : 4;

    for (let i = 0; i < steps; i++) {
        const p = (i >> 1) & 1;
        const q = i & 1;
        let res;
        if (op === 'NEGASI') res = !(!i);
        else if (op === 'TAUTOLOGI') res = true;
        else if (op === 'KONTRADIKSI') res = false;
        else res = data.check(p, q);

        if (res) allFalse = false;
        else allTrue = false;
    }

    if (allTrue) return { type: 'TAUTOLOGI', color: 'status-tautologi', text: 'TAUTOLOGI' };
    if (allFalse) return { type: 'KONTRADIKSI', color: 'status-kontradiksi', text: 'KONTRADIKSI' };
    return { type: 'KONTINGENSI', color: 'status-kontingensi', text: 'KONTINGENSI' };
}

function proses(op, btnElement) {
    document.querySelectorAll('.btn-group button').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    const rawP = document.getElementById('p').value;
    const rawQ = document.getElementById('q').value;

    const pObj = analyzeInput(rawP);
    const qObj = analyzeInput(rawQ);

    // Validasi Input
    const singleInputOps = ['NEGASI', 'TAUTOLOGI', 'KONTRADIKSI'];

    // Logic Validasi yang lebih ramah
    if (pObj === null) {
        alert(`Input P "${rawP}" tidak dikenali.\nCoba gunakan kata: Benar, Salah, Nyala, Mati, 1, 0, dll.`);
        return;
    }
    if (!singleInputOps.includes(op) && qObj === null) {
        alert(`Input Q "${rawQ}" tidak dikenali.\nCoba gunakan kata: Benar, Salah, Nyala, Mati, 1, 0, dll.`);
        return;
    }

    const p = pObj.bool;
    const q = singleInputOps.includes(op) ? false : qObj.bool;

    // Hitung Logika
    const data = logicData[op];
    const result = data.check(p, q);

    // Tentukan Sifat Proposisi
    const propStatus = determineProperty(op, data);

    // Render UI
    renderStatus(propStatus);
    renderMathNotation(op, p, q, result, data);
    renderTruthTable(op, p, q, data);
    renderAnalysis(op, pObj, qObj, result, data, propStatus);
}

function renderStatus(status) {
    const html = `<div class="status-badge ${status.color}">SIFAT: ${status.text}</div>`;
    document.getElementById('statusContainer').innerHTML = html;
}

function renderMathNotation(op, p, q, result, data) {
    const valP = p ? 'T' : 'F';
    const valQ = q ? 'T' : 'F';
    const valRes = result ? 'T' : 'F';
    const colorClass = result ? 'math-res-t' : 'math-res-f';

    let expression = "";
    if (op === 'NEGASI' || op === 'TAUTOLOGI' || op === 'KONTRADIKSI') {
        expression = `${data.formula('p')} ≡ <span class="${colorClass}">${valRes}</span>`;
    } else {
        expression = `${valP} <span class="math-symbol">${data.symbol}</span> ${valQ} ≡ <span class="${colorClass}">${valRes}</span>`;
    }
    document.getElementById('mathDisplay').innerHTML = expression;
}

function renderTruthTable(op, currentP, currentQ, data) {
    const singleVar = ['NEGASI', 'TAUTOLOGI', 'KONTRADIKSI'].includes(op);

    let headerHTML = `<th>p</th>`;
    if (!singleVar) headerHTML += `<th>q</th>`;
    headerHTML += `<th>Result</th><th style="text-align:left; padding-left:15px">Nilai</th>`;

    let html = `<table class="truth-table"><thead><tr>${headerHTML}</tr></thead><tbody>`;
    const steps = singleVar ? 2 : 4;

    for (let i = 0; i < steps; i++) {
        const p = (i >> 1) & 1;
        const q = i & 1;

        let res;
        if (op === 'NEGASI') res = !(!i);
        else if (op === 'TAUTOLOGI') res = true;
        else if (op === 'KONTRADIKSI') res = false;
        else res = data.check(p, q);

        const finalP = singleVar ? (i === 1 ? 'T' : 'F') : (!singleVar && i >= 2) ? 'T' : 'F';
        const finalQ = (!singleVar && (i % 2 !== 0)) ? 'T' : 'F';
        const mathRes = res ? 'T' : 'F';

        let isActive = false;
        if (singleVar) isActive = (currentP ? 1 : 0) === i;
        else isActive = (currentP ? 1 : 0) === (i >= 2 ? 1 : 0) && (currentQ ? 1 : 0) === (i % 2 !== 0 ? 1 : 0);

        html += `
        <tr class="${isActive ? 'row-active' : ''}">
            <td>${finalP}</td>
            ${!singleVar ? `<td>${finalQ}</td>` : ''}
            <td style="color:${res ? 'var(--true)' : 'var(--false)'}; font-weight:bold">${mathRes}</td>
            <td class="desc-col">${mathRes}</td>
        </tr>`;
    }
    html += `</tbody></table>`;
    document.getElementById('tableContainer').innerHTML = html;
}

function renderAnalysis(op, pObj, qObj, result, data, propStatus) {
    const p = pObj.bool;
    const q = qObj ? qObj.bool : false;

    const pVal = p ? 'Benar (T)' : 'Salah (F)';
    const qVal = q ? 'Benar (T)' : 'Salah (F)';

    const pUser = `<span class="detected-badge">${pObj.original}</span>`;
    const qUser = qObj ? `<span class="detected-badge">${qObj.original}</span>` : '';

    let propDesc = "";
    if (propStatus.type === 'TAUTOLOGI') propDesc = "Proposisi ini adalah <b>Tautologi</b> (Selalu Benar).";
    else if (propStatus.type === 'KONTRADIKSI') propDesc = "Proposisi ini adalah <b>Kontradiksi</b> (Selalu Salah).";
    else propDesc = "Proposisi ini adalah <b>Kontingensi</b> (Hasil tergantung input).";

    const html = `
        <div style="margin-bottom:10px;">
            <strong>Sifat:</strong> ${propDesc}
        </div>
        <hr style="border-color:#444">
        <div>
            <strong>Analisis Input:</strong><br>
            Anda memasukkan: p=${pUser} ${!['NEGASI', 'TAUTOLOGI', 'KONTRADIKSI'].includes(op) ? ` dan q=${qUser}` : ''}<br><br>
            
            Sistem mendeteksi:<br>
            <span class="prop-var">p</span> = ${pVal}<br>
            ${!['NEGASI', 'TAUTOLOGI', 'KONTRADIKSI'].includes(op) ? `<span class="prop-var">q</span> = ${qVal}<br>` : ''}
            <br>
            Hasil operasi <b>${op}</b> adalah <b>${result ? 'Benar (T)' : 'Salah (F)'}</b>.
        </div>
    `;
    document.getElementById('explanationContainer').innerHTML = html;
}