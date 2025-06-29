'use client'

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { TooltipLabel } from '../toolTipLabel';
import { StratumForm, VisualizacaoStratum, Stratum } from '@/lib/stratumSchema';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stratum: VisualizacaoStratum | null;
  onSave: (data: StratumForm) => void;
}

export function StratumEditModal({ isOpen, onClose, stratum, onSave }: Props) {
  const [fullStratum, setFullStratum] = useState<VisualizacaoStratum | null>(stratum);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      if (isOpen && stratum?.id && stratum?.projectId) {
        setLoading(true);
        try {
          const projetoRes = await fetch(`http://localhost:8888/project/${stratum.projectId}`);
          const projeto = await projetoRes.json();
          const zoneName = (projeto.ecologicalZone).toLowerCase();

          const [agbbgb, agb, agbgrowth] = await Promise.all([
            fetch(`http://localhost:8888/stratum/biomass/agbbgb/${zoneName}`).then(res => res.json()),
            fetch(`http://localhost:8888/stratum/biomass/agb/${zoneName}`).then(res => res.json()),
            fetch(`http://localhost:8888/stratum/biomass/agbgrowth/${zoneName}`).then(res => res.json()),
          ]);

          const stratumRes = await fetch(`http://localhost:8888/stratum/${stratum.id}`);
          const stratumData = await stratumRes.json();

          setFullStratum({
            ...stratumData,
            agbToBgbRatio: Array.isArray(agbbgb) ? agbbgb[0] : agbbgb,
            agbStockProject: Array.isArray(agb) ? agb[0] : agb,
            agbGrowthProject: Array.isArray(agbgrowth) ? agbgrowth[0] : agbgrowth,
          });
        } catch (e) {
          setFullStratum(stratum);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchAll();
  }, [isOpen, stratum]);

  const handleClose = () => {
    setFullStratum(stratum);
    onClose();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm('Tem certeza que deseja salvar as alterações?')) {
      if (fullStratum) {
        onSave({
          name: fullStratum.name,
          landUseBaseline: fullStratum.landUseBaseline,
          landUseProject: fullStratum.landUseProject,
          projectId: fullStratum.projectId,
          agbStockBaseline: fullStratum.agbStockBaseline ?? null,
          agbGrowthBaseline: fullStratum.agbGrowthBaseline ?? null,
          agbStockProject: fullStratum.agbStockProject ?? null,
          agbGrowthProject: fullStratum.agbGrowthProject ?? null,
          bgbToAgbRatio: fullStratum.bgbToAgbRatio ?? null,
          yearsToAgbMaxStock: fullStratum.yearsToAgbMaxStock ?? null,
          SOCref: fullStratum.SOCref ?? null,
          flu: fullStratum.flu ?? null,
          fi: fullStratum.fi ?? null,
          SOCbaseline: fullStratum.SOCbaseline ?? null,
          SOCmaxProject: fullStratum.SOCmaxProject ?? null,
          AnnualSOCchange: fullStratum.AnnualSOCchange ?? null,
          yearsToSOCmaxProject: fullStratum.yearsToSOCmaxProject ?? null,
        });
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4">Editar Stratum</Dialog.Title>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium">Nome</label>
              <input
                id="name"
                value={fullStratum?.name ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, name: e.target.value } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="landUseBaseline" className="block font-medium">Uso Atual da Terra</label>
              <input
                id="landUseBaseline"
                value={fullStratum?.landUseBaseline ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, landUseBaseline: e.target.value } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="landUseProject" className="block font-medium">Uso Projetado da Terra</label>
              <input
                id="landUseProject"
                value={fullStratum?.landUseProject ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, landUseProject: e.target.value } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <TooltipLabel
                label="AGB Stock"
                tooltip="Quantidade atual de biomassa acima da terra (Above Ground Biomass) acumulada na área"
              />
              <input
                id="agbStockBaseline"
                type="number"
                value={fullStratum?.agbStockBaseline ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, agbStockBaseline: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <TooltipLabel
                label="AGB Growth"
                tooltip="Taxa de crescimento anual de biomassa acima da terra (Above Ground Biomass)"
              />
              <input
                id="agbGrowthBaseline"
                type="number"
                value={fullStratum?.agbGrowthBaseline ?? ''}
                onChange={e =>
                  setFullStratum(fs =>
                    fs ? { ...fs, agbGrowthBaseline: e.target.value === '' ? null : Number(e.target.value) } : fs
                  )
                }
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <TooltipLabel
                label="AGB max stock (Project)"
                tooltip="Estoque máximo projetado de biomassa acima da terra (Above Ground Biomass) no projeto"
              />
              <input
                id="agbStockProject"
                value={fullStratum?.agbStockProject ?? ''}
                readOnly
                tabIndex={-1}
                className="w-full border p-2 rounded bg-gray-300 text-gray-600"
              />
            </div>

            <div>
              <TooltipLabel
                label="AGB growth (Project)"
                tooltip="Taxa de crescimento projetada de biomassa acima da terra (Above Ground Biomass) no projeto"
              />
              <input
                id="agbGrowthProject"
                value={fullStratum?.agbGrowthProject ?? ''}
                readOnly
                tabIndex={-1}
                className="w-full border p-2 rounded bg-gray-300 text-gray-600"
              />
            </div>

            <div>
              <TooltipLabel
                label="AGB to BGB ratio"
                tooltip="Proporção entre biomassa subterrânea (BGB) e biomassa acima da terra (AGB)"
              />
              <input
                id="bgbToAgbRatio"
                value={fullStratum?.bgbToAgbRatio ?? ''}
                readOnly
                tabIndex={-1}
                className="w-full border p-2 rounded bg-gray-300 text-gray-600"
              />
            </div>
             <div>
              <TooltipLabel
                label="Years to AGBmax stock (Project)"
                tooltip="Anos estimados até atingir o estoque máximo de AGB no projeto"
              />
              <input
                id="yearsToAgbMaxStock"
                type="number"
                value={fullStratum?.yearsToAgbMaxStock ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, yearsToAgbMaxStock: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>
             <div>
              <TooltipLabel
                label="SOCref"
                tooltip="SOCref"
              />
              <input
                id="SOCref"
                type="number"
                value={fullStratum?.SOCref ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, SOCref: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>
             <div>
              <TooltipLabel
                label="flu"
                tooltip="flu"
              />
              <input
                id="flu"
                type="number"
                value={fullStratum?.flu ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, flu: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>
             <div>
              <TooltipLabel
                label="fi"
                tooltip="fi"
              />
              <input
                id="fi"
                type="number"
                value={fullStratum?.fi ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, fi: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>
             <div>
              <TooltipLabel
                label="SOCbaseline"
                tooltip="SOCbaseline"
              />
              <input
                id="SOCbaseline"
                type="number"
                value={fullStratum?.SOCbaseline ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, SOCbaseline: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>
             <div>
              <TooltipLabel
                label="SOCmaxProject"
                tooltip="SOCmaxProject"
              />
              <input
                id="SOCmaxProject"
                type="number"
                value={fullStratum?.SOCmaxProject ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, SOCmaxProject: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>
             <div>
              <TooltipLabel
                label="AnnualSOCchange"
                tooltip="AnnualSOCchange"
              />
              <input
                id="AnnualSOCchange"
                type="number"
                value={fullStratum?.AnnualSOCchange ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, AnnualSOCchange: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>
             <div>
              <TooltipLabel
                label="yearsToSOCmaxProject"
                tooltip="yearsToSOCmaxProject"
              />
              <input
                id="yearsToSOCmaxProject"
                type="number"
                value={fullStratum?.yearsToSOCmaxProject ?? ''}
                onChange={e => setFullStratum(fs => fs ? { ...fs, yearsToSOCmaxProject: Number(e.target.value) } : fs)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
