import { Box } from '@chakra-ui/react';
import SharedHeader from '../header/SharedHeader';

const SharedLayout: React.FC = ({ children }) => (
  <>
    <header style={{ position: 'sticky', top: 0 }}>
      <SharedHeader />
    </header>

    <main>
      <Box p={4}>{children}</Box>
    </main>
  </>
);

export default SharedLayout;
