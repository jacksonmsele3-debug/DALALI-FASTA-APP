// access_guard.js - Inalinda kurasa za Dalali Fasta

async function verifyAccess() {
    // A. Angalia kama ametengeneza akaunti / ameingia
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
        window.location.href = "login.html";
        return;
    }

    // B. Chukua taarifa za majaribio na malipo kutoka 'profiles'
    const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('is_paid, trial_ends_at, subscription_ends_at')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.error("Taarifa za profile hazikupatikana:", profileError);
        return;
    }

    const sasa = new Date();
    const mwishoTrial = new Date(profile.trial_ends_at);
    const mwishoKifurushi = profile.subscription_ends_at ? new Date(profile.subscription_ends_at) : null;

    // C. Ukaguzi wa Haki ya Kuingia
    const ipoTrial = sasa <= mwishoTrial;
    const ipoKifurushi = profile.is_paid && mwishoKifurushi && (sasa <= mwishoKifurushi);

    if (ipoTrial || ipoKifurushi) {
        // Ruhusu kuendelea kutumia Dashboard
        console.log("Ruhusa imekubaliwa.");
    } else {
        // Zuia na Mpeleke ukurasa wa Malipo
        if (!window.location.pathname.includes('payment.html')) {
            alert("Muda wako wa siku 7 za bure umeisha. Tafadhali lipia ili kufungua Dashboard.");
            window.location.href = "payment.html";
        }
    }
}

// Endesha mara tu ukurasa unapofunguka
document.addEventListener('DOMContentLoaded', verifyAccess);