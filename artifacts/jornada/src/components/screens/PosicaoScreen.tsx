import { useState } from "react";
import { calcularOverall, sugerirPosicao } from "@/engine/engine";
import type { Atributos, Posicao } from "@/engine/types";

const OPCOES: { posicao: Posicao; nome: string; descricao: string }[] = [
  { posicao: "GOL", nome: "Goleiro", descricao: "Último a falhar, primeiro a ser cobrado." },
  { posicao: "ZAG", nome: "Zagueiro", descricao: "A base da defesa, onde os jogos se ganham." },
  { posicao: "MEI", nome: "Meio-campista", descricao: "O motor do time, entre a defesa e o ataque." },
  { posicao: "ATA", nome: "Atacante", descricao: "Feito para decidir jogos e balançar as redes." },
];

export function PosicaoScreen({
  atributos,
  onEscolher,
}: {
  atributos: Atributos;
  onEscolher: (posicao: Posicao, nome: string) => void;
}) {
  const [nome, setNome] = useState("");
  const sugerida = sugerirPosicao(atributos);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Escolha sua posição</h1>
        <p className="mt-2 text-muted-foreground">
          Com base no seu draft, você se sairia melhor como <strong>{OPCOES.find((o) => o.posicao === sugerida)?.nome}</strong>.
        </p>
      </div>

      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do seu atleta"
        className="w-full rounded-md border bg-background px-4 py-2 text-center text-lg"
        maxLength={24}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {OPCOES.map((opcao) => {
          const overall = calcularOverall(atributos, opcao.posicao);
          return (
            <button
              key={opcao.posicao}
              disabled={!nome.trim()}
              onClick={() => onEscolher(opcao.posicao, nome.trim())}
              className="hover-elevate active-elevate-2 flex flex-col gap-2 rounded-xl border p-6 text-left disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{opcao.nome}</h2>
                <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                  OVR {overall}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{opcao.descricao}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
