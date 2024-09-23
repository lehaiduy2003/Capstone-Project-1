import Container from "@/components/Container";
import Title from "@/components/Title";
import React from "react";

const HomeScreen = () => {
  return (
    <Container
      flex={1}
      bgColor="#fff"
      alignItems="flex-start"
      justifyContent="flex-start"
      paddingVertical={50}
    >
      <Title
        title="Create Account"
        fontSize={30}
        fontWeight={"bold"}
        paddingHorizontal={10}
      />
      <Title
        title="Starting with create your account"
        fontSize={14}
        paddingHorizontal={10}
        fontStyle="italic"
      />
    </Container>
  );
};

export default HomeScreen;
