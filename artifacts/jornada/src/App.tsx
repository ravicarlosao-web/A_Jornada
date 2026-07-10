import { useCareer } from "@/state/useCareer";
import { StatusBar } from "@/components/StatusBar";
import { ModoScreen } from "@/components/screens/ModoScreen";
import { DificuldadeScreen } from "@/components/screens/DificuldadeScreen";
import { DraftScreen } from "@/components/screens/DraftScreen";
import { PosicaoScreen } from "@/components/screens/PosicaoScreen";
import { PreTemporadaScreen } from "@/components/screens/PreTemporadaScreen";
import { TreinoScreen } from "@/components/screens/TreinoScreen";
import { ResumoTemporadaScreen } from "@/components/screens/ResumoTemporadaScreen";
import { ContratoScreen } from "@/components/screens/ContratoScreen";
import { ResultadoFinalScreen } from "@/components/screens/ResultadoFinalScreen";
import { PosCarreiraScreen } from "@/components/screens/PosCarreiraScreen";
import { ConversaTecnicoScreen } from "@/components/screens/ConversaTecnicoScreen";
import { PatrocinioScreen } from "@/components/screens/PatrocinioScreen";
import { PartidaAoVivoScreen } from "@/components/screens/PartidaAoVivoScreen";
import { LojaScreen } from "@/components/screens/LojaScreen";

const FASES_COM_STATUSBAR = new Set([
  "pre-temporada",
  "treino",
  "loja",
  "partida-ao-vivo",
  "resumo-temporada",
  "contrato",
  "conversa-tecnico",
  "patrocinio",
]);

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
    escolherProposta,
    negociarPropostaContrato,
    aposentar,
    escolherPosCarreira,
    gerarOpcoesPosCarreira,
    escolherConversaTecnico,
    escolherPatrocinio,
    verResumoTemporada,
    abrirLoja,
    fecharLoja,
    comprarNaLoja,
    abrirConversaTecnico,
  } = useCareer();

  const mostrarStatusBar = estado.jogador && FASES_COM_STATUSBAR.has(estado.fase);

  return (
    <div className="min-h-screen w-full bg-background text-foreground [background-image:radial-gradient(circle_at_top,_hsl(var(--primary)/0.08),_transparent_55%)]">
      {mostrarStatusBar && estado.jogador && <StatusBar jogador={estado.jogador} />}

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
        <PreTemporadaScreen
          jogador={estado.jogador}
          onAvancar={avancarDaPreTemporada}
          onAbrirLoja={abrirLoja}
          onAbrirConversaTecnico={abrirConversaTecnico}
        />
      )}

      {estado.fase === "loja" && estado.jogador && (
        <LojaScreen
          jogador={estado.jogador}
          mensagem={estado.mensagemLoja}
          onComprar={comprarNaLoja}
          onFechar={fecharLoja}
        />
      )}

      {estado.fase === "treino" && estado.jogador && (
        <TreinoScreen
          jogador={estado.jogador}
          ultimoFocoTreino={estado.ultimoFocoTreino}
          onConfirmar={confirmarTreino}
        />
      )}

      {estado.fase === "partida-ao-vivo" && estado.ultimoRegistro && estado.jogador && (
        <PartidaAoVivoScreen
          momentos={estado.ultimoRegistro.melhoresMomentos ?? []}
          clube={estado.ultimoRegistro.clube}
          temporada={estado.ultimoRegistro.temporada}
          onFinalizar={verResumoTemporada}
        />
      )}

      {estado.fase === "resumo-temporada" && estado.ultimoRegistro && estado.jogador && (
        <ResumoTemporadaScreen
          registro={estado.ultimoRegistro}
          jogador={estado.jogador}
          onContinuar={continuarCarreira}
          onAposentar={aposentar}
          podeAposentar={(estado.jogador?.idade ?? 0) >= 28}
        />
      )}

      {estado.fase === "conversa-tecnico" && estado.jogador && (
        <ConversaTecnicoScreen jogador={estado.jogador} onEscolher={escolherConversaTecnico} />
      )}

      {estado.fase === "patrocinio" && estado.propostaPatrocinioPendente && (
        <PatrocinioScreen proposta={estado.propostaPatrocinioPendente} onEscolher={escolherPatrocinio} />
      )}

      {estado.fase === "contrato" && estado.jogador && (
        <ContratoScreen
          jogador={estado.jogador}
          propostas={estado.propostasContrato}
          mensagensNegociacao={estado.mensagensNegociacao}
          onEscolher={escolherProposta}
          onNegociar={negociarPropostaContrato}
        />
      )}

      {estado.fase === "pos-carreira" && estado.jogador && (
        <PosCarreiraScreen
          jogador={estado.jogador}
          opcoes={gerarOpcoesPosCarreira(estado.jogador)}
          onEscolher={escolherPosCarreira}
        />
      )}

      {estado.fase === "resultado-final" && estado.jogador && (
        <ResultadoFinalScreen
          jogador={estado.jogador}
          onNovaCarreira={iniciarNovaCarreira}
          epilogo={estado.epilogoPosCarreira}
        />
      )}
    </div>
  );
}

export default App;
