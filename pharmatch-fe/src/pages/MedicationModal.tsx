import React, { useState, useEffect } from 'react';
import { Medication } from '../types';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medication: Partial<Medication>) => Promise<void>;
  initialData?: Partial<Medication>;
  isEdit?: boolean;
}

const emptyLang = { fr: '', en: '', ar: '' };
const defaultMed: Partial<Medication> = {
  name: { ...emptyLang },
  description: { ...emptyLang },
  category: { ...emptyLang },
  prescription: false,
};

const ensureLang = (obj?: { fr?: string; en?: string; ar?: string }) => ({
  fr: obj?.fr ?? '',
  en: obj?.en ?? '',
  ar: obj?.ar ?? '',
});

const MedicationModal: React.FC<MedicationModalProps> = ({ isOpen, onClose, onSave, initialData, isEdit }) => {
  const [form, setForm] = useState<Partial<Medication>>(defaultMed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultMed,
        ...initialData,
        name: ensureLang(initialData.name),
        description: ensureLang(initialData.description),
        category: ensureLang(initialData.category),
      });
    } else {
      setForm(defaultMed);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('name.')) {
      setForm(f => ({ ...f, name: { ...ensureLang(f.name), [name.split('.')[1]]: value } }));
    } else if (name.startsWith('description.')) {
      setForm(f => ({ ...f, description: { ...ensureLang(f.description), [name.split('.')[1]]: value } }));
    } else if (name.startsWith('category.')) {
      setForm(f => ({ ...f, category: { ...ensureLang(f.category), [name.split('.')[1]]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, prescription: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de l\'enregistrement.');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">×</button>
        <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Modifier' : 'Ajouter'} un médicament</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom (FR)</label>
            <input name="name.fr" value={form.name?.fr || ''} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Description (FR)</label>
            <textarea name="description.fr" value={form.description?.fr || ''} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Catégorie (FR)</label>
            <input name="category.fr" value={form.category?.fr || ''} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="prescription" name="prescription" checked={!!form.prescription} onChange={handleCheckbox} className="mr-2" />
            <label htmlFor="prescription" className="text-sm">Sur ordonnance</label>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Annuler</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? 'Enregistrement...' : isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationModal; 