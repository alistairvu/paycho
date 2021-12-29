import { Box } from '@chakra-ui/react';
import SharedHeader from '../header/SharedHeader';

const SharedLayout: React.FC = ({ children }) => (
  <div style={{ width: '100%' }}>
    <header style={{ position: 'sticky', top: 0 }}>
      <SharedHeader />
    </header>

    <main>
      <Box p={4}>{children}</Box>
    </main>
  </div>
);

export default SharedLayout;
