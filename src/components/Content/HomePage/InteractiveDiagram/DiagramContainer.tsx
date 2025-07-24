import type { ReactElement } from "react";
import { ReactFlow, Controls } from "@xyflow/react";
import { FormattedMessage } from "react-intl";
import useDiagramLayout from "./diagrammHooks/useDiagramLayout";
import diagramNodeClickHandler from "./utils/diagramNodeClickHandler";
import useDiagramStore from "./diagrammHooks/useDiagramStore";
import { diagramRegistry } from "./utils/diagramRegistry";
import TableComponent from "./TableComponent";

/**
 * Die Hauptansichtskomponente für das interaktive Diagramm.
 * Sie verwendet den `useDiagramLayout`-Hook für die Logik und Zustandsverwaltung
 * und kümmert sich um das Rendern des Diagramms oder eines Ladezustands.
 */
const DiagramView = (): ReactElement => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    isLoadingLayout,
    hasLayouted,
    flowContainerRef, // Ref wird vom Hook bereitgestellt und hier verwendet
    collapseNode,
    handleToggleAll,
  } = useDiagramLayout();
  const handleNodeClick = diagramNodeClickHandler(collapseNode);

  const { diagramId, setDiagramId, tableData, setTableData } =
    useDiagramStore();
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  // Prüfen, ob es sich um ein Baumdiagramm handelt
  const isTreeDiagram = !!diagramRegistry[diagramId]?.treeConfig;

  return (
    <div className="box diagram-container-wrapper">
      <h3 className="title is-4 has-text-centered">
        <FormattedMessage id="diagram_title" defaultMessage="Datenübersicht" />
      </h3>
      <p className="title is-5 has-text-centered">
        {diagramId === "root"
          ? "Hauptdiagramm"
          : `Subdiagramm: ${capitalize(diagramId)}`}
      </p>

      {/* Zurück-Schaltfläche und Auf-/Zuklapp-Buttons */}
      <div className="has-text-right mb-4">
        <div className="field has-addons diagram-buttons-responsive">
          {isTreeDiagram && (
            <>
              <button
                type="button"
                className="button is-light"
                onClick={() => handleToggleAll(false)}
              >
                <FormattedMessage
                  id="diagram_expand_all"
                  defaultMessage="Alles aufklappen [ + ]"
                />
              </button>

              <button
                type="button"
                className="button is-light"
                onClick={() => handleToggleAll(true)}
              >
                <FormattedMessage
                  id="diagram_collapse_all"
                  defaultMessage="Alles zuklappen [ - ]"
                />
              </button>
            </>
          )}
          {diagramId !== "root" && (
            <button
              type="button"
              aria-label="Zurück zur Übersicht"
              className="button is-light"
              onClick={() => setDiagramId("root")}
            >
              <FormattedMessage
                id="diagram_back_button"
                defaultMessage="🔙 Zurück zur Übersicht"
              />
            </button>
          )}
        </div>
      </div>
      {/* Diagramm-Container */}
      <div className="diagram-layout-container">
      {/* Container für das React Flow Diagramm */}
      {/* Das ref wird hier an den Container gebunden, den der Hook für Größenmessungen benötigt. */}
      {/* Die CSS-Klasse 'is-loading' oder 'loaded' steuert die Sichtbarkeit und Übergänge. */}
        <div
          ref={flowContainerRef}
          className={`diagram-reactflow-container ${
            !hasLayouted || isLoadingLayout ? "is-loading" : "loaded"
          }`}
        >
          {/* Bedingtes Rendering: Zeige Lade-Text oder das Diagramm */}
          {!hasLayouted ? (
            <p className="loading-text">
              <FormattedMessage
                id="diagram_loading"
                defaultMessage="Layout wird berechnet..."
              />
            </p>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange} // Handler für Knotenänderungen
              onEdgesChange={onEdgesChange} // Handler für Kantenänderungen
              nodesDraggable={false} // Deaktiviert Drag & Drop für Knoten
              onNodeClick={handleNodeClick} // Knoten-Klick-Handler
              attributionPosition="bottom-right" // Position des ReactFlow-Logos
              minZoom={0.6} // Minimaler Zoomfaktor für das Diagramm.
              panOnScroll={true} // Ermöglicht das Verschieben des Diagramms mit dem Mausrad
              fitView // Automatisches Anpassen der Ansicht an den Inhalt
            
            >
              {/* <Background />
             Hintergrund des Diagramms (z.B. Punkte oder Linien) */}
             {/* <MiniMap /> Kleine Übersichtskarte des Diagramms */}
              <Controls
                position="top-left"
                showZoom={true}
                showFitView={true}
                showInteractive={false}
              />{" "}
              {/*Zeigt die Standard-Steuerelemente (Zoom, Fit View, etc.) von ReactFlow an. */}
            </ReactFlow>
          )}
        </div>

        {/* Anzeige der Tabelle, wenn Daten vorhanden sind */}
        {tableData && (
          <TableComponent data={tableData} onClose={() => setTableData(null)} />
        )}
      </div>
    </div>
  );
};

export default DiagramView;
