import { useState } from 'react';
import { CogIcon, BellIcon, ShieldCheckIcon, UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../../services/api/admin';

// ── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    type="button"
    className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
  >
    <span className="sr-only">Toggle setting</span>
    <span
      aria-hidden="true"
      className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);

// ── Save row ──────────────────────────────────────────────────────────────────
const SaveRow = ({ isSaving, onSave, onCancel, showCancel = false }) => (
  <div className="pt-4 flex justify-end gap-3">
    {showCancel && (
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Cancel
      </button>
    )}
    <button
      type="button"
      onClick={onSave}
      disabled={isSaving}
      className="inline-flex justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSaving ? 'Saving…' : 'Save Changes'}
    </button>
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving]   = useState(false);
  const [toast, setToast]         = useState(null); // 'success' | 'error' | null

  // ── General state ──────────────────────────────────────────────────────────
  const [general, setGeneral] = useState({
    siteName: 'Trek Your World',
    siteDescription: "Discover the world's most breathtaking treks and adventures.",
    timezone: 'UTC+5.5',
    language: 'en',
  });

  // ── Notification state ─────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    newUserAlerts: false,
    bookingAlerts: true,
  });

  // ── Security state ─────────────────────────────────────────────────────────
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    passwordExpiry: '90days',
    loginAlerts: true,
  });

  // ── Account state ──────────────────────────────────────────────────────────
  const [account, setAccount] = useState({
    name: 'Admin User',
    email: 'admin@trekyourworld.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (tab, data) => {
    setIsSaving(true);
    try {
      await adminService.saveSettings(tab, data);
      showToast('success');
    } catch {
      showToast('error');
    } finally {
      setIsSaving(false);
    }
  };

  const tabDataMap = {
    general: general,
    notifications: notifications,
    security: security,
    account: { name: account.name, email: account.email },
  };

  return (
    <div>
      {/* Toast */}
      {toast === 'success' && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircleIcon className="w-5 h-5" />
          Settings saved successfully.
        </div>
      )}
      {toast === 'error' && (
        <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg text-sm">
          Failed to save settings. Please try again later.
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        {/* Mobile select */}
        <div className="sm:hidden p-4">
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="general">General</option>
            <option value="notifications">Notifications</option>
            <option value="security">Security &amp; Privacy</option>
            <option value="account">Account</option>
          </select>
        </div>

        {/* Desktop tabs */}
        <div className="hidden sm:block border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { key: 'general', label: 'General', Icon: CogIcon },
              { key: 'notifications', label: 'Notifications', Icon: BellIcon },
              { key: 'security', label: 'Security & Privacy', Icon: ShieldCheckIcon },
              { key: 'account', label: 'Account', Icon: UserCircleIcon },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 inline-block mr-2 -mt-1" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* ── General ─────────────────────────────────────────────────────── */}
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">Site Name</label>
                  <input
                    type="text"
                    id="site-name"
                    value={general.siteName}
                    onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="site-description" className="block text-sm font-medium text-gray-700">Site Description</label>
                  <textarea
                    id="site-description"
                    rows={3}
                    value={general.siteDescription}
                    onChange={(e) => setGeneral({ ...general, siteDescription: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    id="timezone"
                    value={general.timezone}
                    onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="UTC+1">UTC+1 (Central European Time)</option>
                    <option value="UTC+2">UTC+2 (Eastern European Time)</option>
                    <option value="UTC+5.5">UTC+5:30 (Indian Standard Time)</option>
                    <option value="UTC+8">UTC+8 (China Standard Time)</option>
                    <option value="UTC+9">UTC+9 (Japan Standard Time)</option>
                    <option value="UTC-5">UTC-5 (Eastern Standard Time)</option>
                    <option value="UTC-8">UTC-8 (Pacific Standard Time)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                  <select
                    id="language"
                    value={general.language}
                    onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="zh">Chinese</option>
                    <option value="ja">Japanese</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
                <SaveRow
                  isSaving={isSaving}
                  onSave={() => handleSave('general', tabDataMap.general)}
                  showCancel
                />
              </div>
            </div>
          )}

          {/* ── Notifications ────────────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about account activity' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get push notifications in your browser' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summaries of site activities' },
                  { key: 'newUserAlerts', label: 'New User Alerts', desc: 'Get notified when new users register' },
                  { key: 'bookingAlerts', label: 'Booking Alerts', desc: 'Get notified of new trek bookings' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">{label}</h3>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[key]}
                      onChange={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                    />
                  </div>
                ))}
                <SaveRow
                  isSaving={isSaving}
                  onSave={() => handleSave('notifications', tabDataMap.notifications)}
                />
              </div>
            </div>
          )}

          {/* ── Security ─────────────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Security &amp; Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Toggle
                    checked={security.twoFactorAuth}
                    onChange={() => setSecurity({ ...security, twoFactorAuth: !security.twoFactorAuth })}
                  />
                </div>
                <div>
                  <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700">Password Expiry</label>
                  <select
                    id="passwordExpiry"
                    value={security.passwordExpiry}
                    onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="never">Never</option>
                    <option value="30days">Every 30 days</option>
                    <option value="60days">Every 60 days</option>
                    <option value="90days">Every 90 days</option>
                    <option value="180days">Every 180 days</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Login Alerts</h3>
                    <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                  </div>
                  <Toggle
                    checked={security.loginAlerts}
                    onChange={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}
                  />
                </div>
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Session Management</h3>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Sign Out All Other Sessions
                  </button>
                </div>
                <SaveRow
                  isSaving={isSaving}
                  onSave={() => handleSave('security', tabDataMap.security)}
                />
              </div>
            </div>
          )}

          {/* ── Account ──────────────────────────────────────────────────────── */}
          {activeTab === 'account' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={account.name}
                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Change Password</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                      <input
                        type="password"
                        id="current-password"
                        value={account.currentPassword}
                        onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        id="new-password"
                        value={account.newPassword}
                        onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirm-password"
                        value={account.confirmPassword}
                        onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Danger Zone</h3>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Account
                  </button>
                </div>
                <SaveRow
                  isSaving={isSaving}
                  onSave={() => handleSave('account', tabDataMap.account)}
                  showCancel
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
