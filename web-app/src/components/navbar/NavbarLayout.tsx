type LayoutProps = {
  children: React.ReactNode;
};

const NavbarLayout = ({ children }: LayoutProps) => (
  <main className="flex-grow p-4 bg-pink-50">{children}</main>
);

export default NavbarLayout;
