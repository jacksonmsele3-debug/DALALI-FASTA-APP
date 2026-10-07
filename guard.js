// guard.js - Weka juu ya kila ukurasa wa Dashboard
async function checkAccessPermission() {
    const user = supabaseClient.auth.user();
    
    // Kama hajajiunga (Not logged in)
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Pata taarifa za malipo kutoka profiles
    const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('is_paid, trial_ends_at, subscription_ends_at')
        .eq('id', user.id)
        .single();

    if (error || !profile) {
        console.error("Hitilafu ya kupata taarifa:", error);
        return;
    }

    const now = new Date();
    const trialEnd = new Date(profile.trial_ends_at);
    const subEnd = profile.subscription_ends_at ? new Date(profile.subscription_ends_at) : null;

    // 1. Angalia kama yupo kwenye Siku 7 za bure
    const isTrialActive = now <= trialEnd;

    // 2. Angalia kama kifurushi alicholipia bado kiko hai
    const isSubscriptionActive = profile.is_paid && subEnd && (now <= subEnd);

    // Kama hana trial na hajalipia -> Mpeleke Sehemu ya Malipo
    if (!isTrialActive && !isSubscriptionActive) {
        // Kama yupo tayari kwenye payment.html asijirudie
        if (!window.location.pathname.includes('payment.html')) {
            alert("Muda wako wa siku 7 za bure umeisha. Tafadhali lipia ili kufungua Dashboard.");
            window.location.href = "payment.html";
        }
    }
}

// Fanya ukaguzi pale tu ukurasa unapofunguka
window.addEventListener('DOMContentLoaded', checkAccessPermission);