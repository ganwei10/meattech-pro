import { getSiteGlobalConfig } from '@/lib/siteConfig';
import AskQuestionClient from './AskQuestionClient';

export const dynamic = 'force-dynamic';

export default async function AskPage() {
  const config = await getSiteGlobalConfig();
  return <AskQuestionClient config={config.ask} />;
}
