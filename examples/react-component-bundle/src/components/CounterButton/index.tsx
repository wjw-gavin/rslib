import React from 'react';
import styles from './index.module.scss';
import svg from './assets/react.svg'

interface CounterButtonProps {
  onClick: () => void;
  label: string;
}

export const CounterButton: React.FC<CounterButtonProps> = ({
  onClick,
  label,
}) => (
  <>
  <button type="button" className={styles.button} onClick={onClick}>
  <img src={svg} /> 
    {label}
  </button>
  </>
);
