import './App.css';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

interface Item {
  id: number;
  value: string;
  label: string;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debouncedFunction = function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  } as DebouncedFunction<T>;

  debouncedFunction.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debouncedFunction;
}

function App() {
  const [data, setData] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSkip(0);
  };

  const fetchData = (searchQuery: string, skipCount: number) => {
    if (searchQuery.trim() === '') {
      setError("Поле запроса не может быть пустым.");
      return;
    }
    setLoading(true);
    axios.get<{ items: Item[] }>(`https://vk-testing-api.vk-mini-apps-dev.magicgophers.com/?take=5&skip=${skipCount}&query=${searchQuery}`)
      .then(response => {
        const newData = response.data.items;
        const combinedData = [...data, ...newData];
        const uniqueData = Array.from(new Map(combinedData.map(item => [item.id, item])).values());

        setData(uniqueData);
        setSkip(prevSkip => prevSkip + newData.length);
        setLoading(false);
      })
      .catch((error: AxiosError) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    const debouncedFetchData = debounce(() => {
      setData([]);
      fetchData(inputValue.trim(), 0);
    }, 500);
    if (inputValue.trim() !== '') {
      debouncedFetchData();
    } else {
      setData([]);
    }
    return () => {
      debouncedFetchData.cancel();
      setData([]);
    };
  }, [inputValue]);

  const handleCheckboxChange = (itemValue: string) => {
    setSelectedItems(prevSelectedItems => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(itemValue)) {
        newSelectedItems.delete(itemValue);
      } else {
        newSelectedItems.add(itemValue);
      }
      return newSelectedItems;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedItems(new Set());
    setInputValue('');
    setData([]);
    setSkip(0);
    setError(null);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.05 && !loading) {
      fetchData(inputValue, skip);
    }
  };


  return (
    <div className='mini-app'>

      <div className='header'>
        <div className='base-panelheader'>
          <div className='status-bar'>
            <div className="time">9:41</div>
            <div className="status-icons">
              <div className="cellular-connection">
              </div>
              <div className="wifi">
              </div>
              <div className="battery">
              </div>
            </div>
          </div>
          <div className='layout'>
            <div className='content-panelheader'>
              <div className='buttons'>
                <button className='button-more'>
                  <span className="dots">•••</span>
                </button>
                <div className='separator'></div>
                <button className='button-cancel'>
                  <span className="close">✖</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <h1 className='label'>Mini App</h1>
      </div>

      <div className='body'>
        <form className='input-form'>
          <input className='input-name' type="text" value={inputValue} onChange={handleInputChange} placeholder='Имя' />
        </form>
        <div className="spacer"></div>
        {inputValue && <div className='checkbox-button-form'>
          <div className='checkbox-form' onScroll={handleScroll}>
            {data
              .filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase())) // Фильтрация
              .sort((a, b) => a.label.localeCompare(b.label)) // Сортировка по алфавиту
              .map(item => (
                <label className='check-label' key={item.id}>
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.value)}
                    onChange={() => handleCheckboxChange(item.value)}
                  />
                  {item.label}
                </label>
              ))}
          </div>
        </div>}
        <div className='button-block'>
          <button
            className='send-button'
            onClick={handleSubmit}
            type='button'
            disabled={selectedItems.size === 0}
          >
            <span className='text-button'>
              Отправить
            </span>
          </button>
        </div>
        <div className='iphone-indicator'>
        </div>
      </div>

    </div>
  );
}

export default App;