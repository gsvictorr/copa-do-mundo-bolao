import { NextResponse } from "next/server";

export async function GET() {
  try {

    const response = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      {
        headers: {
          "X-Auth-Token": process.env.API_FUTEBOL_TOKEN!,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao consultar API");
    }

    const data = await response.json();

    return NextResponse.json(data.matches);

  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}