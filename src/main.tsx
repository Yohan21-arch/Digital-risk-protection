import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { hydrateSupabaseDataset } from './lib/supabaseDataset';

async function bootstrap() {
  const hydration = await hydrateSupabaseDataset();

  if (import.meta.env.DEV) {
    if (hydration.source === 'supabase') {
      console.info(
        `[SentinalBrand] Supabase dataset loaded: ${hydration.brandCount} brands / ${hydration.candidateCount} candidates.`
      );
    } else {
      console.warn(
        `[SentinalBrand] Using local prototype fallback (${hydration.candidateCount} candidates). ${hydration.reason || ''}`
      );
    }
  }

  createRoot(document.getElementById('root')!).render(<App />);
}

void bootstrap();
