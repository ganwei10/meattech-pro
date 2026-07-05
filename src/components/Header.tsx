import { getSiteGlobalConfig } from '@/lib/siteConfig';
import HeaderClient from './HeaderClient';

async function Header() {
  const config = await getSiteGlobalConfig();
  return <HeaderClient config={config.header} />;
}

export default Header;
