import { useState } from "react";
import { calcularOverall, calcularTierFinal } from "@/engine/engine";
import type { Jogador } from "@/engine/types";
import { HallFamaScreen } from "@/components/screens/HallFamaScreen";

const NOME_POSICAO: Record<string, string> = {
  GOL: "Goleiro",
  ZAG: "Zagueiro",
  MEI: "Meio-campista",
  ATA: "Atacante",
};

export function ResultadoFinalScreen({
  jogador,
  onNovaCarreira,
  epilogo,
}: {
  jogador: Jogador;
  onNovaCarreira: () => void;
  epilogo?: string | null;
}) {
  const [mostrarHallFama, setMostrarHallFama] = useState(false);
  const { tier, score } = calcularTierFinal(jogador);
  const overall = calcularOverall(jogador.atributos, jogador.posicao);
  const totalGols = jogador.historicoTemporadas.reduce((acc, t) => acc + t.gols, 0);
  const totalAssist = jogador.historicoTemporadas.reduce((acc, t) => acc + t.assistencias, 0);
  const totalJogos = jogador.historicoTemporadas.reduce((acc, t) => acc + t.jogos, 0);
  const titulos = jogador.historicoTemporadas.filter((t) => t.objetivoCumprido).length;
  const melhorTemporada = jogador.historicoTemporadas.reduce<
    (typeof jogador.historicoTemporadas)[number] | null
  >((melhor, atual) => (!melhor || atual.notaMedia > melhor.notaMedia ? atual : melhor), null);

  if (mostrarHallFama) {
    return <HallFamaScreen onVoltar={() => setMostrarHallFama(false)} />;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Fim de carreira — {jogador.nome} ({NOME_POSICAO[jogador.posicao]})
        </p>
        <h1 className="mt-2 text-4xl font-bold text-primary">{tier.nome}</h1>
        <p className="mt-2 text-muted-foreground">{tier.descricao}</p>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Pontuação" value={score} />
        <Stat label="Overall final" value={overall} />
        <Stat label="Temporadas" value={jogador.historicoTemporadas.length} />
        <Stat label="Objetivos cumpridos" value={titulos} />
        <Stat label="Jogos" value={totalJogos} />
        <Stat label="Gols" value={totalGols} />
        <Stat label="Assistências" value={totalAssist} />
        <Stat label="Prêmios" value={jogador.premios.length} />
      </div>

      {epilogo && (
        <div className="w-full rounded-xl border border-primary/40 bg-primary/5 p-4 text-left">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Pós-carreira</p>
          <p className="mt-1 text-sm leading-relaxed">{epilogo}</p>
        </div>
      )}

      {melhorTemporada && (
        <div className="w-full rounded-xl border border-primary bg-primary/10 p-4 text-left">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Melhor temporada</p>
          <p className="mt-1 font-semibold">
            Temporada {melhorTemporada.temporada} ({melhorTemporada.idade} anos) — {melhorTemporada.clube}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {melhorTemporada.gols} gols, {melhorTemporada.assistencias} assistências, nota média{" "}
            {melhorTemporada.notaMedia.toFixed(1)}
          </p>
        </div>
      )}

      {jogador.historicoTemporadas.length > 0 && (
        <div className="w-full overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Temp.</th>
                <th className="px-3 py-2">Idade</th>
                <th className="px-3 py-2">Clube</th>
                <th className="px-3 py-2">Jogos</th>
                <th className="px-3 py-2">Gols</th>
                <th className="px-3 py-2">Assist.</th>
                <th className="px-3 py-2">Nota</th>
              </tr>
            </thead>
            <tbody>
              {jogador.historicoTemporadas.map((t) => (
                <tr key={t.temporada} className="border-b last:border-0">
                  <td className="px-3 py-2">{t.temporada}</td>
                  <td className="px-3 py-2">{t.idade}</td>
                  <td className="px-3 py-2">{t.clube}</td>
                  <td className="px-3 py-2">{t.jogos}</td>
                  <td className="px-3 py-2">{t.gols}</td>
                  <td className="px-3 py-2">{t.assistencias}</td>
                  <td className="px-3 py-2">{t.notaMedia.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onNovaCarreira}
          className="hover-elevate active-elevate-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground"
        >
          Começar nova jornada
        </button>
        <button
          onClick={() => setMostrarHallFama(true)}
          className="hover-elevate active-elevate-2 rounded-md border px-8 py-3 font-semibold"
        >
          Ver Hall da Fama
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
