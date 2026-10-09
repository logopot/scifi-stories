import React, { useState } from 'react';
import Button from '../../../../components/Button';
import * as S from './RestartControl.styled';

// "Počni ispočetka" sa potvrdom u samoj stranici (bez window.confirm).
export default function RestartControl({ onConfirm }) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button variant="quiet" onClick={() => setAsking(true)}>
        Počni ispočetka
      </Button>
    );
  }

  return (
    <S.Confirm role="group" aria-label="Potvrda početka ispočetka">
      <S.Question>Sačuvano mesto u priči biće obrisano. Da počneš ispočetka?</S.Question>
      <S.Actions>
        <Button onClick={onConfirm}>Da, počni ispočetka</Button>
        <Button variant="quiet" autoFocus onClick={() => setAsking(false)}>
          Ne, odustani
        </Button>
      </S.Actions>
    </S.Confirm>
  );
}
