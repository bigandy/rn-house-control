import PageTitle from "@/components/PageTitle";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const DefaultLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <PageTitle title={title} />
      {children}
    </ParallaxScrollView>
  );
};

export default DefaultLayout;
