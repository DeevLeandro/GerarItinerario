import { useState, useCallback } from 'react';

export const useForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNestedChange = useCallback((parent, id, data) => {
    setFormData(prev => ({
      ...prev,
      [parent]: prev[parent].map(item => item.id === id ? { ...item, ...data } : item)
    }));
  }, []);

  const handleAdd = useCallback((parent, newItem) => {
    setFormData(prev => ({
      ...prev,
      [parent]: [...prev[parent], newItem]
    }));
  }, []);

  const handleRemove = useCallback((parent, id) => {
    setFormData(prev => ({
      ...prev,
      [parent]: prev[parent].filter(item => item.id !== id)
    }));
  }, []);

  const handleDuplicate = useCallback((parent, item) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setFormData(prev => ({
      ...prev,
      [parent]: [...prev[parent], newItem]
    }));
  }, []);

  const resetForm = useCallback((newState) => {
    setFormData(newState);
  }, []);

  return {
    formData,
    handleChange,
    handleNestedChange,
    handleAdd,
    handleRemove,
    handleDuplicate,
    resetForm
  };
};