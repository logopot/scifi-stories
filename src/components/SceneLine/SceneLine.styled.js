import styled from 'styled-components';

export const Root = styled.div`
  margin: 0 0 ${({ theme }) => theme.space[135]};
`;

export const Label = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[30]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.tracking[22]};
  text-transform: uppercase;
  /* btnText: akcenat koji je proveren na pozadini teme (check-themes) */
  color: ${({ theme }) => theme.btnText};
`;

export const Text = styled.p`
  margin: 0;
`;
