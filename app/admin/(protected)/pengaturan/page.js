import { getAllSettings } from '../../../../lib/settings';
import SettingsForm from '../../../../components/SettingsForm';

export default function AdminSettingsPage() {
  const settings = getAllSettings();
  return (
    <>
      <div className="admin-topbar">
        <h1 className="serif">Pengaturan</h1>
      </div>
      <SettingsForm initial={settings} />
    </>
  );
}
