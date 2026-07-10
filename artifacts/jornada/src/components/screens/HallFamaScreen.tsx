import { useEffect, useState } from "react";
import { buscarHallDaFamaGlobal, lerHallDaFama, type EntradaHallFama } from "@/state/hallDaFama";

const NOME_POSICAO: Record<string, string> = {
  GOL: "Goleiro",
  ZAG: "Zagueiro",
  MEI: "Meio-campista",
  ATA: "Atacante",
};

export function HallFamaScreen({ onVoltar }: { onVoltar: () => void }) {
  const [entradas, setEntradas] = useState<EntradaHallFama[]>(() => lerHallDaFama());
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    buscarHallDaFamaGlobal().then((globais) => {
      if (ativo) {
        setEntradas(globais);
        setCarregando(false);
      }
    });
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Hall da Fama</h1>
        <p className="mt-2 text-muted-foreground">
          {carregando
            ? "Sincronizando com o ranking global..."
            : "As melhores carreiras já disputadas, deste dispositivo e de outros jogadores."}
        </p>
      </div>

      {entradas.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Nenhuma carreira encerrada ainda. Termine uma carreira para entrar para a história.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Nome</th>
                <th className="px-3 py-2">Posição</th>
                <th className="px-3 py-2">Legado</th>
                <th className="px-3 py-2">Pontuação</th>
                <th className="px-3 py-2">Overall</th>
                <th className="px-3 py-2">Temp.</th>
                <th className="px-3 py-2">Gols</th>
                <th className="px-3 py-2">Prêmios</th>
              </tr>
            </thead>
            <tbody>
              {entradas.map((e, i) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="px-3 py-2 font-semibold">{i + 1}</td>
                  <td className="px-3 py-2">{e.nome}</td>
                  <td className="px-3 py-2">{NOME_POSICAO[e.posicao] ?? e.posicao}</td>
                  <td className="px-3 py-2 text-primary">{e.tier}</td>
                  <td className="px-3 py-2">{e.score}</td>
                  <td className="px-3 py-2">{e.overallFinal}</td>
                  <td className="px-3 py-2">{e.temporadas}</td>
                  <td className="px-3 py-2">{e.gols}</td>
                  <td className="px-3 py-2">{e.premios}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onVoltar}
          className="hover-elevate active-elevate-2 rounded-md border px-8 py-3 font-semibold"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
