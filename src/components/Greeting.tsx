import { useState } from 'react';

export default function Greeting() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Hello from a React component!</p>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}