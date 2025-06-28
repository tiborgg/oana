import "./index.css";

import { createRoot } from 'react-dom/client'
import { App } from './app';

import dayjs from 'dayjs';
import dayjsObjectSupport from "dayjs/plugin/objectSupport";
import dayjsUtc from "dayjs/plugin/utc";

dayjs.extend(dayjsObjectSupport);
dayjs.extend(dayjsUtc);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)