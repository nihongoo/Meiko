// hooks/useProductForm.js
export const useProductForm = (initialState = {}) => {
    const [state, setState] = useState(initialState);
    const [error, setError] = useState(false);
  
    const handleUpdate = useCallback((field, value) => {
      setState(prev => ({
        ...prev,
        [field]: value
      }));
      setError(false);
    }, []);
  
    return {
      state,
      error,
      handleUpdate,
      setError
    };
  };