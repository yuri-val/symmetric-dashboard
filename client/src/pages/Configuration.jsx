import { memo } from 'react';
import ConfigContainer from '../components/configuration/ConfigContainer';

/**
 * Configuration page component that displays engine configuration
 * @component
 * @returns {JSX.Element} The rendered Configuration page
 */
const Configuration = memo(function Configuration() {
  return <ConfigContainer />;
});

export default Configuration;