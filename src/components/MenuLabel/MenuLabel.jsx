import React from 'react';
import * as S from './MenuLabel.styled';

// `tag` dozvoljava da isti izgled nosi <label> ili <p>.
export default function MenuLabel({ tag, className, children, ...rest }) {
  return (
    <S.Root as={tag} className={className} {...rest}>
      {children}
    </S.Root>
  );
}
