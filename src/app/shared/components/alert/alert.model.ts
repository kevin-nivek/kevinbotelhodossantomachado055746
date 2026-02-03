export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  type: AlertType;
  message: string;
}
