'use client'

import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TooltipLabel } from '../toolTipLabel';
import { stratumFormSchema, StratumForm, VisualizacaoStratum } from '@/lib/stratumSchema';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stratum: VisualizacaoStratum | null;
  onSave: (data: StratumForm) => void;
}

export function StratumEditModal({ isOpen, onClose, stratum, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StratumForm>({
    resolver: zodResolver(stratumFormSchema),
    defaultValues: {
      name: '',
      landUseBaseline: '',
      landUseProject: '',
      projectId: 0,
      AGBstock: 0,
      AGBgrowth: 0,
    },
  });

  useEffect(() => {
    if (stratum) {
      reset({
        name: stratum.name,
        landUseBaseline: stratum.landUseBaseline,
        landUseProject: stratum.landUseProject,
        projectId: stratum.projectId,
        AGBstock: stratum.agbStockBaseline ?? 0,
        AGBgrowth: stratum.agbGrowthBaseline ?? 0,
      });
    }
  }, [stratum, reset]);

  const handleClose = () => {
    reset(); 
    onClose(); 
  };

  const onSubmit = (data: StratumForm) => {
    if (confirm('Tem certeza que deseja salvar as alterações?')) {
      console.log('Dados enviados para onSave:', data);
      onSave(data);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-4">Editar Stratum</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium">Nome</label>
              <input id="name" {...register('name')} className="w-full border p-2 rounded" />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="landUseBaseline" className="block font-medium">Uso Atual da Terra</label>
              <input id="landUseBaseline" {...register('landUseBaseline')} className="w-full border p-2 rounded" />
              {errors.landUseBaseline && <p className="text-red-600 text-sm">{errors.landUseBaseline.message}</p>}
            </div>

            <div>
              <label htmlFor="landUseProject" className="block font-medium">Uso Projetado da Terra</label>
              <input id="landUseProject" {...register('landUseProject')} className="w-full border p-2 rounded" />
              {errors.landUseProject && <p className="text-red-600 text-sm">{errors.landUseProject.message}</p>}
            </div>

            <div>
              <TooltipLabel
                label="AGB Stock"
                tooltip="Quantidade atual de biomassa aérea (Above Ground Biomass) acumulada na área"
              />
              <input
                id="AGBstock"
                type="number"
                {...register('AGBstock', { valueAsNumber: true })}
                className="w-full border p-2 rounded"
              />
              {errors.AGBstock && <p className="text-red-600 text-sm">{errors.AGBstock.message}</p>}
            </div>

            <div>
              <TooltipLabel
                label="AGB Growth"
                tooltip="Taxa de crescimento anual da biomassa aérea (AGB)"
              />
              <input
                id="AGBgrowth"
                type="number"
                {...register('AGBgrowth', { valueAsNumber: true })}
                className="w-full border p-2 rounded"
              />
              {errors.AGBgrowth && <p className="text-red-600 text-sm">{errors.AGBgrowth.message}</p>}
            </div>

            <div>
              <TooltipLabel
                label="AGB max stock (Project)"
                tooltip="Estoque máximo projetado de biomassa aérea no projeto"
              />
              <input
                id="agbMaxStockProject"
                value={stratum?.agbMaxStockProject ?? ''}
                readOnly
                tabIndex={-1}
                className="w-full border p-2 rounded bg-gray-300 text-gray-600"
              />
            </div>

            <div>
              <TooltipLabel
                label="AGB growth (Project)"
                tooltip="Taxa de crescimento projetada de biomassa aérea no projeto"
              />
              <input
                id="agbGrowthProject"
                value={stratum?.agbGrowthProject ?? ''}
                readOnly
                tabIndex={-1}
                className="w-full border p-2 rounded bg-gray-300 text-gray-600"
              />
            </div>

            <div>
              <TooltipLabel
                label="BGB to AGB ratio"
                tooltip="Proporção entre biomassa subterrânea (BGB) e biomassa aérea (AGB)"
              />
              <input
                id="bgbToAgbRatio"
                value={stratum?.bgbToAgbRatio ?? 0}
                readOnly
                tabIndex={-1}
                className="w-full border p-2 rounded bg-gray-300 text-gray-600"
              />
            </div>

            <div>
              <TooltipLabel
                label="Year to AGBmax stock (Project)"
                tooltip="Anos estimados até atingir o estoque máximo de AGB no projeto"
              />
              <input
                id="yearsToAgbMaxStockProject"
                value={stratum?.yearsToAgbMaxStockProject ?? 0}
                readOnly
                tabIndex={-1}
                className="w-full border p-2 rounded bg-gray-300 text-gray-600"
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
