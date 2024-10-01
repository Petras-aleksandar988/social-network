async function getApiKey() {
    let response = await fetch('https://aleksa-scandiweb.shop/socialNetwork/api-key.php');
    let data = await response.json();
    return data.apiKey;
}