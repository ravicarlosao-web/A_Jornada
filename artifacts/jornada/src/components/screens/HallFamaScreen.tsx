import { useEffect, useState } from "react";
import { buscarHallDaFamaGlobal, lerHallDaFama, type EntradaHallFama } from "@/state/hallDaFama";
import { motion } from "framer-motion";
import { Trophy, ChevronLeft, Medal, Star } from "lucide-react";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12"
    >
      <div className="flex flex-col items-center text-center">
        <Trophy className="mb-4 h-16 w-16 text-accent drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" strokeWidth={1} />
        <h1 className="font-display text-6xl uppercase tracking-wide text-foreground">
          Hall da Fama
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground uppercase tracking-widest text-xs font-bold">
          {carregando
            ? "Buscando os nomes eternizados..."
            : "Os maiores astros que já pisaram nos gramados virtuais."}
        </p>
      </div>

      {entradas.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center border border-dashed border-white/10 p-8 text-center text-muted-foreground">
          Ainda não há lendas registradas. Termine sua primeira carreira.
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full overflow-x-auto rounded-none border border-white/10 bg-card/50"
        >
          <table className="w-full text-left whitespace-nowrap">
            <thead className="border-b border-white/10 bg-black/60 text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4 w-16">Pos</th>
                <th className="px-6 py-4">Jogador</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Score</th>
                <th className="px-6 py-4 text-right">OVR</th>
                <th className="px-6 py-4 text-center">Gols</th>
                <th className="px-6 py-4 text-center">Títulos</th>
              </tr>
            </thead>
            <tbody>
              {entradas.map((e, i) => (
                <motion.tr 
                  variants={item}
                  key={e.id} 
                  className={`border-b border-white/5 last:border-0 transition-colors hover:bg-white/5 ${i < 3 ? 'bg-accent/5' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-none font-sports text-xl ${
                      i === 0 ? 'bg-yellow-500 text-black' :
                      i === 1 ? 'bg-slate-300 text-black' :
                      i === 2 ? 'bg-amber-700 text-white' :
                      'bg-white/10 text-muted-foreground'
                    }`}>
                      {i + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-display text-2xl uppercase">{e.nome}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {e.posicao} • {e.temporadas} Temporadas
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      e.tier.includes('Lenda') ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                    }`}>
                      {e.tier.includes('Lenda') ? <Star size={10} /> : <Medal size={10} />}
                      {e.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-sports text-3xl">{e.score.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-sports text-3xl text-muted-foreground">{e.overallFinal}</td>
                  <td className="px-6 py-4 text-center font-sports text-2xl">{e.gols}</td>
                  <td className="px-6 py-4 text-center font-sports text-2xl text-muted-foreground">{e.premios}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={onVoltar}
          className="group flex items-center gap-2 rounded-none border border-white/20 bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-widest text-foreground transition-all hover:bg-white/5"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Voltar aos Vestiários
        </button>
      </div>
    </motion.div>
  );
}
