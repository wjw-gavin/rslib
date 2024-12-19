import React from 'react';
import svg from '../../assets/logo.svg';
import styles from './index.module.scss';

interface CounterButtonProps {
  onClick: () => void;
  label: string;
}

export const CounterButton: React.FC<CounterButtonProps> = ({
  onClick,
  label,
}) => (
  <button type="button" className={styles.button} onClick={onClick}>
    <img src={svg} />
    {label}
  </button>
);
