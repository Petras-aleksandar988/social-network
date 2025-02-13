async function getApiKey() {
    let response = await fetch('http://localhost:8000//api-key.php');
    let data = await response.json();
    return data.apiKey;
}