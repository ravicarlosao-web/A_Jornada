import { useState } from "react";
import type { Jogador } from "@/engine/types";

export function PreTemporadaScreen({
  jogador,
  onAvancar,
}: {
  jogador: Jogador;
  onAvancar: (mentorarJovem?: boolean) => void;
}) {
  const temporadaNumero = jogador.historicoTemporadas.length + 1;
  const contratoRestante = jogador.contrato.anosRestantes;
  const [mentorar, setMentorar] = useState(false);
  const podeMentorar = jogador.modo === "completo" && jogador.idade >= 24;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Temporada {temporadaNumero} — {jogador.idade} anos
        </p>
        <h1 className="mt-1 text-3xl font-bold">Pré-temporada no {jogador.clubeAtual.nome}</h1>
      </div>

      <p className="text-muted-foreground">
        A diretoria do {jogador.clubeAtual.nome} está de olho na sua evolução nesta temporada.
        {contratoRestante <= 1 && " Seu contrato está próximo do fim — uma nova negociação se aproxima."}
      </p>

      <div className="grid w-full grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Contrato</p>
          <p className="mt-1 text-lg font-bold">
            {contratoRestante} {contratoRestante === 1 ? "ano restante" : "anos restantes"}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Prêmios na carreira</p>
          <p className="mt-1 text-lg font-bold">{jogador.premios.length}</p>
        </div>
      </div>

      {podeMentorar && (
        <label className="flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left hover-elevate">
          <input
            type="checkbox"
            checked={mentorar}
            onChange={(e) => setMentorar(e.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="block font-medium">Mentorar um jovem da base</span>
            <span className="block text-sm text-muted-foreground">
              Investe seu tempo em uma promessa do clube. Você ganha Liderança e deixa uma marca no vestiário.
            </span>
          </span>
        </label>
      )}

      <button
        onClick={() => onAvancar(mentorar)}
        className="hover-elevate active-elevate-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground"
      >
        {jogador.modo === "completo" ? "Ir para treino" : "Iniciar temporada"}
      </button>
    </div>
  );
}
