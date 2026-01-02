import Header from "../Header";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default AppLayout;
