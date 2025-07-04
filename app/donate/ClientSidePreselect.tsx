'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  onSelect: (id: string) => void;
}

export default function ClientSidePreselect({ onSelect }: Props) {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId');

  useEffect(() => {
    if (campaignId) {
      onSelect(campaignId);
    }
  }, [campaignId, onSelect]);

  return null;
}
