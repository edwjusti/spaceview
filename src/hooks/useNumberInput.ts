import { useCallback, useState } from 'react';
import { capitalize } from '../util';

interface InputError {
  error: boolean;
  helperText?: string;
}

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

function useNumberInput(
  initial: number,
  min: number = 0,
  max: number = Infinity
) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<InputError>({ error: false });
  const onChange = useCallback((ev: ChangeEvent) => {
    const currentValue = ev.target.value.trim();
    const name = capitalize(ev.target.name ?? 'value');

    setError({ error: false });

    if (!currentValue) {
      setError({
        error: true,
        helperText: `${name} is required`,
      });
      setValue(initial);
      return;
    }

    if (!/^-?[0-9]+$/.test(currentValue)) return ev.preventDefault();

    const num = parseInt(currentValue);

    if (num < min)
      setError({
        error: true,
        helperText: `${name} must be greater than ${min}`,
      });

    if (num > max)
      setError({
        error: true,
        helperText: `${name} must be lower than ${max}`,
      });

    setValue(num);
  }, []);

  return {
    value,
    onChange,
    ...error,
  };
}

export default useNumberInput;
