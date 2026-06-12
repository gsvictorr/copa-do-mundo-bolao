
export async function getJogosHoje() {
    const response = await fetch("/api/partidas/hoje");

    if (!response.ok) {

        throw new Error("Erro ao buscar partidas");
    }

    return response.json();
}




export async function getJogosHistorico() {
    const response = await fetch("/api/partidas/historico");

    if (!response.ok) {

        throw new Error("Erro ao buscar partidas");
    }

    return response.json();
}