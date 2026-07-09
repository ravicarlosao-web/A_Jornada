import { useCareer } from "@/state/useCareer";
import { ModoScreen } from "@/components/screens/ModoScreen";
import { DificuldadeScreen } from "@/components/screens/DificuldadeScreen";
import { DraftScreen } from "@/components/screens/DraftScreen";
import { PosicaoScreen } from "@/components/screens/PosicaoScreen";
import { PreTemporadaScreen } from "@/components/screens/PreTemporadaScreen";
import { TreinoScreen } from "@/components/screens/TreinoScreen";
import { ResumoTemporadaScreen } from "@/components/screens/ResumoTemporadaScreen";
import { ResultadoFinalScreen } from "@/components/screens/ResultadoFinalScreen";

function App() {
  const {
    estado,
    iniciarNovaCarreira,
    escolherModo,
    escolherDificuldade,
    escolherOpcaoDraft,
    escolherPosicao,
    avancarDaPreTemporada,
    confirmarTreino,
    continuarCarreira,
    aposentar,
  } = useCareer();

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {estado.fase === "inicio" && <ModoScreen onEscolher={escolherModo} />}

      {estado.fase === "dificuldade" && <DificuldadeScreen onEscolher={escolherDificuldade} />}

      {estado.fase === "draft" && (
        <DraftScreen
          rodada={estado.rodadaDraft}
          totalRodadas={8}
          opcoes={estado.opcoesDraftAtuais}
          atributos={estado.atributosDraft}
          onEscolher={escolherOpcaoDraft}
        />
      )}

      {estado.fase === "posicao" && (
        <PosicaoScreen atributos={estado.atributosDraft} onEscolher={escolherPosicao} />
      )}

      {estado.fase === "pre-temporada" && estado.jogador && (
        <PreTemporadaScreen jogador={estado.jogador} onAvancar={avancarDaPreTemporada} />
      )}

      {estado.fase === "treino" && <TreinoScreen onConfirmar={confirmarTreino} />}

      {estado.fase === "resumo-temporada" && estado.ultimoRegistro && (
        <ResumoTemporadaScreen
          registro={estado.ultimoRegistro}
          onContinuar={continuarCarreira}
          onAposentar={aposentar}
          podeAposentar={(estado.jogador?.idade ?? 0) >= 28}
        />
      )}

      {estado.fase === "resultado-final" && estado.jogador && (
        <ResultadoFinalScreen jogador={estado.jogador} onNovaCarreira={iniciarNovaCarreira} />
      )}
    </div>
  );
}

export default App;
