import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f0f2f5;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const LinkCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #007bff;
  font-weight: 600;
  font-size: 18px;

  &:hover {
    color: #0056b3;
  }
`;

export default function Home() {
  return (
    <Container>
      <Title>Frontend Master Homework</Title>
      <LinkCard>
        <StyledLink href="/week5">
          Week 5 - 사용자 프로필 폼 리팩토링
        </StyledLink>
      </LinkCard>
    </Container>
  );
}
