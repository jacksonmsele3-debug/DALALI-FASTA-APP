<?php
header("Content-Type: application/json; charset=UTF-8");

// 1. KUSHIKANISHA NA DATABASE
$host = 'localhost';
$db   = 'dalali_fasta';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(["reply" => "Samahani, kuna tatizo la kiufundi kwenye mfumo."]);
    exit();
}

// 2. KUKUBALI UJUMBE KUTOKA KWA MTEJA
$input = json_decode(file_get_contents('php://input'), true);
$userMessage = trim($input['message'] ?? '');

if (empty($userMessage)) {
    echo json_encode(["reply" => "Tafadhali andika ujumbe wako."]);
    exit();
}

$lowerMsg = mb_strtolower($userMessage);

// 3. SALAMU NA MASWALI YA KAWAIDA
if (in_array($lowerMsg, ['mambo', 'habari', 'hello', 'hi', 'nahitaji nyumba', 'nataka nyumba'])) {
    $response = "Karibu Dalali Fasta 😊\n\nTafadhali niambie:\n• Mkoa\n• Wilaya\n• Eneo\n• Bajeti\n• Idadi ya vyumba\n\nili nikutafutie nyumba zinazokufaa.";
    echo json_encode(["reply" => $response]);
    exit();
}

// 4. KUCHAMBUA MKOA AU ENEO KUTOKA KWENYE UJUMBE
$regions = ['dar es salaam', 'arusha', 'mwanza', 'dodoma', 'mbeya', 'tanga', 'zanzibar', 'kinondoni', 'kimara', 'ubungo'];
$foundLocation = "";

foreach ($regions as $loc) {
    if (strpos($lowerMsg, $loc) !== false) {
        $foundLocation = $loc;
        break;
    }
}

// Kuchambua Bajeti (kama ametaja namba)
$maxPrice = null;
if (preg_match('/(\d+)/', $lowerMsg, $matches)) {
    $maxPrice = (int)$matches[1];
    if (strpos($lowerMsg, 'laki') !== false) {
        $maxPrice = $maxPrice * 100000;
    }
}

// 5. KUTAFUTA KWENYE DATABASE (SQL QUERY)
$sql = "SELECT * FROM properties WHERE status = 'approved'";
$params = [];

if ($foundLocation) {
    $sql .= " AND (region LIKE ? OR district LIKE ? OR area LIKE ?)";
    $params[] = "%$foundLocation%";
    $params[] = "%$foundLocation%";
    $params[] = "%$foundLocation%";
}

if ($maxPrice && $maxPrice > 10000) {
    $sql .= " AND price <= ?";
    $params[] = $maxPrice;
}

$sql .= " LIMIT 3";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$results = $stmt->fetchAll();

// 6. FORMULATE AI REPLY
if (count($results) > 0) {
    $reply = "Nimefanikiwa kupata mali zinazolingana na mahitaji yako:\n\n";
    foreach ($results as $item) {
        $reply .= "🏠 *" . $item['title'] . "*\n";
        $reply .= "📍 Eneo: " . $item['area'] . ", " . $item['region'] . "\n";
        $reply .= "💰 Bei: Tsh " . number_format($item['price']) . "\n";
        $reply .= "🛏️ Vyumba: " . $item['bedrooms'] . "\n\n";
    }
    $reply .= "Fungua tangazo kwenye app ili kupata mawasiliano ya wakala!";
} else {
    $reply = "Samahani, kwa sasa hakuna mali inayolingana na vigezo ulivyoweka.\n\nUnaweza kuongeza bajeti au kubadilisha eneo.";
}

echo json_encode(["reply" => $reply]);