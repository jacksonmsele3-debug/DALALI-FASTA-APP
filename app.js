// Kazi hii inafanyika mara tu ukurasa unapomaliza kupakia
document.addEventListener("DOMContentLoaded", () => {
    anzishaMfumo();
    pakiaNyumbaKwenyeIndex();
    pakiaNyumbaKwenyeDashboard();
});

// data za majaribio (kama hakuna nyumba zilizohifadhiwa bado)
const nyumbaZaMwanzo = [
    {
        id: "1",
        kichwa: "Apartment ya Kifahari yenye feni",
        eneo: "Masaki, Dar es Salaam",
        hali: "Inapangishwa",
        bei: "550K/Mwezi",
        vyumba: 2,
        bafu: 2,
        ukubwa: 350,
        picha: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "2",
        kichwa: "Nyumba Nzima ya Kisasa na Kiwanja",
        eneo: "Njiro, Arusha",
        hali: "Inauzwa",
        bei: "120M",
        vyumba: 4,
        bafu: 3,
        ukubwa: 600,
        picha: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
    }
];

// Anzisha LocalStorage
function anzishaMfumo() {
    if (!localStorage.getItem("nyumba_data")) {
        localStorage.setItem("nyumba_data", JSON.stringify(nyumbaZaMwanzo));
    }
}

// Pata data zote za nyumba
function pataNyumba() {
    return JSON.parse(localStorage.getItem("nyumba_data")) || [];
}

// Hifadhi data mpya ya nyumba
function hifadhiNyumba(data) {
    localStorage.setItem("nyumba_data", JSON.stringify(data));
}

// 1. PAKIA NYUMBA KWENYE INDEX.HTML (UKURASA WA MBELE)
function pakiaNyumbaKwenyeIndex() {
    const gridYaNyumba = document.getElementById("index-grid-nyumba");
    if (!gridYaNyumba) return; // Hakikisha tupo kwenye index.html

    const nyumbaZote = pataNyumba();
    gridYaNyumba.innerHTML = "";

    if (nyumbaZote.length === 0) {
        gridYaNyumba.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Hakuna nyumba zilizopo sokoni kwa sasa.</p>`;
        return;
    }

    nyumbaZote.forEach(nyumba => {
        const kadi = `
            <div class="property-card">
                <div class="image-wrapper">
                    <img src="${nyumba.picha || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'}" alt="${nyumba.kichwa}">
                    <span class="status-badge">${nyumba.hali}</span>
                    <span class="price-badge">${nyumba.bei}</span>
                </div>
                <div class="card-body">
                    <h3>${nyumba.kichwa}</h3>
                    <div class="card-location">
                        <i class="fa-solid fa-location-dot"></i> ${nyumba.eneo}
                    </div>
                    <div class="card-features">
                        <span><i class="fa-solid fa-bed"></i> ${nyumba.vyumba} Vyumba</span>
                        <span><i class="fa-solid fa-bath"></i> ${nyumba.bafu} Bafu</span>
                        <span><i class="fa-solid fa-cube"></i> ${nyumba.ukubwa} sqft</span>
                    </div>
                </div>
            </div>
        `;
        gridYaNyumba.innerHTML += kadi;
    });
}

// 2. MIFUMO YA DASHBOARD (KWA ADMIN / DALALI)
function pakiaNyumbaKwenyeDashboard() {
    const jedwaliLaDashboard = document.getElementById("dashboard-table-body");
    if (!jedwaliLaDashboard) return; // Hakikisha tupo kwenye dashboard.html

    const nyumbaZote = pataNyumba();
    jedwaliLaDashboard.innerHTML = "";

    // Sasisha idadi ya nyumba kwenye vishikizo vya takwimu (Stat Cards)
    const idadiNyumbaEl = document.getElementById("total-properties");
    if (idadiNyumbaEl) idadiNyumbaEl.innerText = nyumbaZote.length;

    nyumbaZote.forEach((nyumba, index) => {
        const mstari = `
            <tr>
                <td><img src="${nyumba.picha}" class="td-img" alt=""></td>
                <td><strong>${nyumba.kichwa}</strong></td>
                <td>${nyumba.eneo}</td>
                <td><span class="badge ${nyumba.hali === 'Inauzwa' ? 'badge-sale' : 'badge-rent'}">${nyumba.hali}</span></td>
                <td><strong style="color: var(--primary);">${nyumba.bei}</strong></td>
                <td>
                    <button class="btn-action btn-delete" onclick="futaNyumba('${nyumba.id}')">
                        <i class="fa-solid fa-trash"></i> Futa
                    </button>
                </td>
            </tr>
        `;
        jedwaliLaDashboard.innerHTML += mstari;
    });
}

// Ongeza Nyumba Mpya (Kutoka kwenye Fomu ya Dashboard)
const fomuYaNyumba = document.getElementById("form-ongeza-nyumba");
if (fomuYaNyumba) {
    fomuYaNyumba.addEventListener("submit", (e) => {
        e.preventDefault();

        const kichwa = document.getElementById("prop-title").value;
        const eneo = document.getElementById("prop-location").value;
        const hali = document.getElementById("prop-status").value;
        const bei = document.getElementById("prop-price").value;
        const vyumba = document.getElementById("prop-beds").value;
        const bafu = document.getElementById("prop-baths").value;
        const ukubwa = document.getElementById("prop-size").value;
        const picha = document.getElementById("prop-image").value || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80";

        const nyumbaMpya = {
            id: Date.now().toString(), // Kitambulisho cha kipekee
            kichwa,
            eneo,
            hali,
            bei,
            vyumba: parseInt(vyumba),
            bafu: parseInt(bafu),
            ukubwa: parseInt(ukubwa),
            picha
        };

        const nyumbaZilizopo = pataNyumba();
        nyumbaZilizopo.unshift(nyumbaMpya); // Weka mwanzo wa orodha
        hifadhiNyumba(nyumbaZilizopo);

        // Safisha fomu na upakie upya data
        fomuYaNyumba.reset();
        pakiaNyumbaKwenyeDashboard();
        alert("Nyumba imeongezwa sokoni kikamilifu!");
    });
}

// Futa Nyumba
window.futaNyumba = function(id) {
    if (confirm("Je, una uhakika unataka kuiondoa nyumba hii sokoni?")) {
        let nyumbaZilizopo = pataNyumba();
        nyumbaZilizopo = nyumbaZilizopo.filter(n => n.id !== id);
        hifadhiNyumba(nyumbaZilizopo);
        pakiaNyumbaKwenyeDashboard();
    }
};